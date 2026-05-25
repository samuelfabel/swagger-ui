/**
 * @prettier
 */
import extractSearchEntries from "./extract-search-data"

/**
 * Builds the in-memory Deep Search index for a resolved OpenAPI spec.
 *
 * @param {Object} spec - Resolved OpenAPI specification (plain JS object)
 * @param {Object<string, boolean>} activeScopes - Enabled searchable scope flags
 * @returns {Array<Object>} Search index entries
 */
export const buildIndex = (spec, activeScopes) => {
  if (!spec || typeof spec !== "object") {
    return []
  }

  return extractSearchEntries(spec, activeScopes)
}

export default buildIndex
