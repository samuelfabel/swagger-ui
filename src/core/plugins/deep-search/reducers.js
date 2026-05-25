/**
 * @prettier
 */
import { fromJS } from "immutable"
import { DEFAULT_SCOPES } from "./constants"
import {
  UPDATE_QUERY,
  SET_SCOPES,
  TOGGLE_SCOPE,
  SET_INDEX,
  SET_MODAL_OPEN,
  INITIALIZE,
} from "./actions"

const initialState = fromJS({
  query: "",
  scopes: DEFAULT_SCOPES,
  index: [],
  modalOpen: false,
  initialized: false,
})

export default {
  [INITIALIZE]: (state, action) => {
    state = state || initialState

    return state.merge(
      fromJS({
        scopes: action.payload.scopes,
        initialized: true,
      })
    )
  },

  [UPDATE_QUERY]: (state, action) => {
    state = state || initialState
    return state.set("query", action.payload)
  },

  [SET_SCOPES]: (state, action) => {
    state = state || initialState
    return state.set("scopes", fromJS(action.payload))
  },

  [TOGGLE_SCOPE]: (state, action) => {
    state = state || initialState
    const scopeKey = action.payload
    const current = state.getIn(["scopes", scopeKey], false)
    return state.setIn(["scopes", scopeKey], !current)
  },

  [SET_INDEX]: (state, action) => {
    state = state || initialState
    return state.set("index", fromJS(action.payload))
  },

  [SET_MODAL_OPEN]: (state, action) => {
    state = state || initialState
    return state.set("modalOpen", action.payload)
  },
}
