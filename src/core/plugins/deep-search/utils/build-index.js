/**
 * @prettier
 */
import extractSearchEntries from "./extract-search-data"

export const buildIndex = (spec, activeScopes) => {
  if (!spec || typeof spec !== "object") {
    return []
  }

  return extractSearchEntries(spec, activeScopes)
}

export default buildIndex
