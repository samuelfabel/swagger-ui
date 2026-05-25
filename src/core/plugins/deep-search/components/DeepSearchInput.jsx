/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import debounce from "lodash/debounce"
import SearchScopeSelector from "./SearchScopeSelector"
import DeepSearchModal from "./DeepSearchModal"

export default class DeepSearchInput extends React.Component {
  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    deepSearchSelectors: PropTypes.object.isRequired,
    deepSearchActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      localQuery: props.deepSearchSelectors.currentQuery() || "",
    }

    this.debouncedUpdateQuery = debounce((value) => {
      props.deepSearchActions.updateQuery(value)
    }, 300)
  }

  componentWillUnmount() {
    this.debouncedUpdateQuery.cancel()
  }

  onSearchChange = (event) => {
    const { value } = event.target
    this.setState({ localQuery: value })
    this.debouncedUpdateQuery(value)
  }

  onOpenModal = () => {
    this.props.deepSearchActions.setModalOpen(true)
  }

  onCloseModal = () => {
    this.props.deepSearchActions.setModalOpen(false)
  }

  onToggleScope = (scopeKey) => {
    this.props.deepSearchActions.toggleScope(scopeKey)
  }

  onKeyDown = (event) => {
    if (event.key === "Escape") {
      this.onCloseModal()
    }
  }

  render() {
    const { specSelectors, deepSearchSelectors, getComponent, getConfigs } =
      this.props

    const Col = getComponent("Col")
    const deepSearchConfig = getConfigs().deepSearch || {}
    const allowRuntimeScopeSelection =
      deepSearchConfig.allowRuntimeScopeSelection !== false

    const isLoading = specSelectors.loadingStatus() === "loading"
    const isFailed = specSelectors.loadingStatus() === "failed"
    const scopes = deepSearchSelectors.activeScopes()
    const isModalOpen = deepSearchSelectors.isModalOpen()

    const classNames = ["operation-filter-input", "deep-search-input"]
    if (isFailed) classNames.push("failed")
    if (isLoading) classNames.push("loading")

    return (
      <div className="filter-container deep-search-container">
        <Col className="filter wrapper" mobile={12}>
          <div className="deep-search-input-row">
            <input
              className={classNames.join(" ")}
              placeholder="Search operations, parameters, schemas..."
              type="search"
              onChange={this.onSearchChange}
              onKeyDown={this.onKeyDown}
              value={this.state.localQuery}
              disabled={isLoading}
              aria-label="Deep search"
            />
            <SearchScopeSelector
              onOpen={this.onOpenModal}
              allowRuntimeScopeSelection={allowRuntimeScopeSelection}
            />
          </div>
        </Col>
        {isModalOpen && allowRuntimeScopeSelection ? (
          <DeepSearchModal
            scopes={scopes}
            onToggleScope={this.onToggleScope}
            onClose={this.onCloseModal}
            getComponent={getComponent}
          />
        ) : null}
      </div>
    )
  }
}
