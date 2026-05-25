/**
 * @prettier
 */
import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import { taggedOperations } from "./spec-extensions/wrap-selector"
import wrapActions from "./wrap-actions"
import buildIndex from "./utils/build-index"
import DeepSearchInput from "./components/DeepSearchInput"
import FilterContainerWrapper from "./wrap-components/filter-container"

export default function DeepSearchPlugin() {
  return {
    components: {
      DeepSearchInput,
    },
    fn: {
      buildIndex,
    },
    wrapComponents: {
      FilterContainer: FilterContainerWrapper,
    },
    statePlugins: {
      deepSearch: {
        reducers,
        actions,
        selectors,
        wrapActions: {
          setScopes: wrapActions.setScopes,
          toggleScope: wrapActions.toggleScope,
        },
      },
      configs: {
        wrapActions: {
          loaded: wrapActions.loaded,
        },
      },
      spec: {
        wrapActions: {
          updateJsonSpec: wrapActions.updateJsonSpec,
        },
        wrapSelectors: {
          taggedOperations,
        },
      },
    },
  }
}
