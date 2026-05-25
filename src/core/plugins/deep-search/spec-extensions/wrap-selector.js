/**
 * @prettier
 */
import { OrderedMap } from "immutable"

export const taggedOperations =
  (oriSelector, system) =>
  (state, ...args) => {
    let taggedOps = oriSelector(state, ...args)
    const { deepSearchSelectors, getConfigs } = system.getSystem()
    const deepSearchConfig = getConfigs().deepSearch || {}

    if (!deepSearchConfig.enabled) {
      return taggedOps
    }

    const query = deepSearchSelectors.currentQuery(state)

    if (!query || !query.trim()) {
      return taggedOps
    }

    const matchingKeys = deepSearchSelectors.matchingOperationKeys(state)

    if (!matchingKeys || matchingKeys.size === 0) {
      return OrderedMap()
    }

    return taggedOps
      .map((tagObj) => {
        const operations = tagObj
          .get("operations")
          .filter((op) =>
            matchingKeys.has(`${op.get("method")}:${op.get("path")}`)
          )

        return tagObj.set("operations", operations)
      })
      .filter((tagObj) => tagObj.get("operations").size > 0)
  }

export default taggedOperations
