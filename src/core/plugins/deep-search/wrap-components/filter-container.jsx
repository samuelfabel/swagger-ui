/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const FilterContainerWrapper = (Original) => {
  const WrappedFilterContainer = (props) => {
    const { getConfigs, getComponent } = props
    const deepSearchConfig = getConfigs().deepSearch || {}

    if (!deepSearchConfig.enabled) {
      return <Original {...props} />
    }

    const DeepSearchInput = getComponent("DeepSearchInput")
    return <DeepSearchInput {...props} />
  }

  WrappedFilterContainer.propTypes = {
    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  return WrappedFilterContainer
}

export default FilterContainerWrapper
