/**
 * @prettier
 */
import { OPERATION_METHODS } from "../constants"

export const HTTP_METHODS = new Set(OPERATION_METHODS)

export const normalizeQuery = (query) => (query || "").trim().toLowerCase()

export const isHttpMethodQuery = (query) => HTTP_METHODS.has(normalizeQuery(query))

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
