/**
 * @prettier
 */
import { createSelector } from "reselect"
import { fromJS, Set } from "immutable"
import { DEFAULT_SCOPES, SEARCH_SCOPE_DEFINITIONS } from "./constants"
import searchEntries from "./utils/search-engine"

const state = (state) => state || fromJS({})

export const currentQuery = createSelector(state, (deepSearchState) =>
  deepSearchState.get("query", "")
)

export const scopes = createSelector(state, (deepSearchState) =>
  deepSearchState.get("scopes", fromJS(DEFAULT_SCOPES))
)

export const activeScopes = createSelector(scopes, (scopeMap) =>
  scopeMap.toJS()
)

export const index = createSelector(state, (deepSearchState) =>
  deepSearchState.get("index", fromJS([])).toJS()
)

export const isModalOpen = createSelector(state, (deepSearchState) =>
  deepSearchState.get("modalOpen", false)
)

export const isInitialized = createSelector(state, (deepSearchState) =>
  deepSearchState.get("initialized", false)
)

export const scopeDefinitions = () => SEARCH_SCOPE_DEFINITIONS

export const matchingOperations = createSelector(
  currentQuery,
  index,
  activeScopes,
  (query, searchIndex, activeScopeMap) => {
    const results = searchEntries(searchIndex, query, activeScopeMap)
    return results
  }
)

export const matchingOperationKeys = createSelector(
  matchingOperations,
  (matches) => {
    if (!matches) {
      return null
    }

    return Set(Array.from(matches.keys()))
  }
)
