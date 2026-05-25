/**
 * @prettier
 */
import { fromJS, OrderedMap, List, Map } from "immutable"
import { taggedOperations } from "core/plugins/deep-search/spec-extensions/wrap-selector"

describe("deep-search wrap-selector", () => {
  const taggedOps = OrderedMap({
    pet: Map({
      operations: List([
        Map({
          path: "/pet",
          method: "post",
        }),
      ]),
    }),
    store: Map({
      operations: List([
        Map({
          path: "/store/order",
          method: "get",
        }),
      ]),
    }),
  })

  it("should passthrough when deep search is disabled", () => {
    const system = {
      getSystem: () => ({
        getConfigs: () => ({ deepSearch: { enabled: false } }),
        deepSearchSelectors: {
          currentQuery: () => "pet",
          matchingOperationKeys: () => fromJS(["post:/pet"]).toSet(),
        },
      }),
    }

    const result = taggedOperations(() => taggedOps, system)(fromJS({}))

    expect(result).toBe(taggedOps)
  })

  it("should filter operations by deep search matches", () => {
    const system = {
      getSystem: () => ({
        getConfigs: () => ({ deepSearch: { enabled: true } }),
        deepSearchSelectors: {
          currentQuery: () => "pet",
          matchingOperationKeys: () => fromJS(["post:/pet"]).toSet(),
        },
      }),
    }

    const result = taggedOperations(() => taggedOps, system)(fromJS({}))

    expect(result.size).toBe(1)
    expect(result.has("pet")).toBe(true)
    expect(result.getIn(["pet", "operations"]).size).toBe(1)
  })
})
