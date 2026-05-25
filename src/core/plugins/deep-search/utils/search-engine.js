/**
 * @prettier
 */
import { OPERATION_METHODS } from "../constants"

/** @type {Set<string>} HTTP methods that trigger strict method-based search. */
export const HTTP_METHODS = new Set(OPERATION_METHODS)

/**
 * Normalizes a user search query for comparison.
 *
 * @param {string} query
 * @returns {string}
 */
export const normalizeQuery = (query) => (query || "").trim().toLowerCase()

/**
 * Returns true when the query matches a known HTTP method name.
 *
 * @param {string} query
 * @returns {boolean}
 */
export const isHttpMethodQuery = (query) =>
  HTTP_METHODS.has(normalizeQuery(query))

/**
 * Scores how well a text value matches a search query.
 *
 * @param {string} text - Indexed searchable text
 * @param {string} query - User search query
 * @param {Object} [options]
 * @param {boolean} [options.strict=false] - When true, avoids loose substring matches (used for HTTP method queries)
 * @returns {number} Score greater than zero when matched, otherwise zero
 */
export const fuzzyScore = (text, query, { strict = false } = {}) => {
  const haystack = (text || "").toLowerCase()
  const needle = normalizeQuery(query)

  if (!needle) {
    return 1
  }

  if (!haystack) {
    return 0
  }

  if (haystack === needle) {
    return 100
  }

  if (haystack.startsWith(needle)) {
    return 90
  }

  const words = haystack.split(/\W+/).filter(Boolean)
  for (const word of words) {
    if (word === needle) {
      return 85
    }

    if (word.startsWith(needle)) {
      return 60
    }

    if (!strict && needle.length >= 3 && word.includes(needle)) {
      return 55
    }
  }

  if (!strict && needle.length >= 3) {
    const substringIndex = haystack.indexOf(needle)
    if (substringIndex !== -1) {
      return 50 + Math.max(0, 20 - substringIndex)
    }
  }

  return 0
}

/**
 * Finds operations that match a query against a pre-built search index.
 *
 * HTTP method queries (for example, `post`) match all operations with that
 * method, plus any scoped text matches using strict word rules.
 *
 * @param {Array} entries - Pre-built index entries from {@link buildIndex}
 * @param {string} query - User search query
 * @param {Object<string, boolean>} activeScopes - Enabled scope flags
 * @returns {Map<string, Object>|null} Matches keyed by `method:path`, or null when query is empty
 */
export const searchEntries = (entries, query, activeScopes) => {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return null
  }

  const strictTextMatch = isHttpMethodQuery(normalizedQuery)
  const matchingOperations = new Map()

  entries.forEach((entry) => {
    let score = 0

    if (strictTextMatch && entry.method === normalizedQuery) {
      score = 110
    }

    if (!activeScopes[entry.type]) {
      if (score <= 0) {
        return
      }
    } else {
      const textScore = fuzzyScore(entry.text, normalizedQuery, {
        strict: strictTextMatch,
      })

      if (textScore > 0) {
        score = Math.max(score, textScore * (entry.weight || 1))
      }
    }

    if (score <= 0) {
      return
    }

    const operationKey = `${entry.method}:${entry.path}`

    const existing = matchingOperations.get(operationKey)

    if (!existing || score > existing.score) {
      matchingOperations.set(operationKey, {
        ...entry,
        score,
      })
    }
  })

  return matchingOperations
}

export default searchEntries
