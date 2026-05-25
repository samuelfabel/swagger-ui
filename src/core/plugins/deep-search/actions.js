/**
 * @prettier
 */

export const UPDATE_QUERY = "deep_search_update_query"
export const SET_SCOPES = "deep_search_set_scopes"
export const TOGGLE_SCOPE = "deep_search_toggle_scope"
export const SET_INDEX = "deep_search_set_index"
export const SET_MODAL_OPEN = "deep_search_set_modal_open"
export const INITIALIZE = "deep_search_initialize"

export const updateQuery = (query) => ({
  type: UPDATE_QUERY,
  payload: query,
})

export const setScopes = (scopes) => ({
  type: SET_SCOPES,
  payload: scopes,
})

export const toggleScope = (scopeKey) => ({
  type: TOGGLE_SCOPE,
  payload: scopeKey,
})

export const setIndex = (index) => ({
  type: SET_INDEX,
  payload: index,
})

export const setModalOpen = (isOpen) => ({
  type: SET_MODAL_OPEN,
  payload: isOpen,
})

export const initialize = (payload) => ({
  type: INITIALIZE,
  payload,
})

export const rebuildIndex = () => (system) => {
  const { specSelectors, deepSearchSelectors, deepSearchActions, getConfigs } =
    system
  const deepSearchConfig = getConfigs().deepSearch || {}

  if (!deepSearchConfig.enabled) {
    return
  }

  const spec = specSelectors.specJsonWithResolvedSubtrees()
  const activeScopes = deepSearchSelectors.activeScopes()

  if (!spec || spec.isEmpty?.()) {
    deepSearchActions.setIndex([])
    return
  }

  const { buildIndex } = system.fn
  deepSearchActions.setIndex(buildIndex(spec.toJS(), activeScopes))
}
