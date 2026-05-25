/**
 * @prettier
 */
import { fromJS } from "immutable"
import reducers from "core/plugins/deep-search/reducers"
import { UPDATE_QUERY, TOGGLE_SCOPE, INITIALIZE } from "core/plugins/deep-search/actions"

describe("deep-search reducers", () => {
  it("should initialize scopes", () => {
    const state = reducers[INITIALIZE](undefined, {
      payload: {
        scopes: {
          paths: true,
          schemas: false,
        },
      },
    })

    expect(state.getIn(["scopes", "paths"])).toBe(true)
    expect(state.getIn(["scopes", "schemas"])).toBe(false)
    expect(state.get("initialized")).toBe(true)
  })

  it("should update query", () => {
    const state = reducers[UPDATE_QUERY](fromJS({}), {
      payload: "cpf",
    })

    expect(state.get("query")).toBe("cpf")
  })

  it("should toggle scope values", () => {
    const initial = fromJS({
      scopes: {
        paths: true,
      },
    })

    const state = reducers[TOGGLE_SCOPE](initial, {
      payload: "paths",
    })

    expect(state.getIn(["scopes", "paths"])).toBe(false)
  })
})
