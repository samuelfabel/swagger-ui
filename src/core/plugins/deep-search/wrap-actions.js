/**
 * @prettier
 */
import { resolveInitialScopes } from "./constants"

export const loaded =
  (ori, system) =>
  (...args) => {
    ori(...args)

    const { deepSearchActions, getConfigs } = system
    const deepSearchConfig = getConfigs().deepSearch || {}

    if (!deepSearchConfig.enabled) {
      return
    }

    deepSearchActions.initialize({
      scopes: resolveInitialScopes(deepSearchConfig),
    })
    deepSearchActions.rebuildIndex()
  }

export const updateJsonSpec =
  (ori, system) =>
  (...args) => {
    ori(...args)

    const { deepSearchActions, getConfigs } = system
    const deepSearchConfig = getConfigs().deepSearch || {}

    if (!deepSearchConfig.enabled) {
      return
    }

    deepSearchActions.rebuildIndex()
  }

export const setScopes =
  (ori, system) =>
  (...args) => {
    ori(...args)
    system.deepSearchActions.rebuildIndex()
  }

export const toggleScope =
  (ori, system) =>
  (...args) => {
    ori(...args)
    system.deepSearchActions.rebuildIndex()
  }

export default {
  loaded,
  updateJsonSpec,
  setScopes,
  toggleScope,
}
