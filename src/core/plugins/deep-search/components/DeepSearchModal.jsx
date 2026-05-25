/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { ALL_SCOPE_KEYS, SEARCH_SCOPE_DEFINITIONS } from "../constants"

class ScopeCheckbox extends React.Component {
  static propTypes = {
    scopeKey: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onToggleScope: PropTypes.func.isRequired,
  }

  onChange = () => {
    this.props.onToggleScope(this.props.scopeKey)
  }

  render() {
    const { scopeKey, checked, label } = this.props

    return (
      <li className="deep-search-scope-item">
        <label htmlFor={`deep-search-scope-${scopeKey}`}>
          <input
            id={`deep-search-scope-${scopeKey}`}
            type="checkbox"
            checked={checked}
            onChange={this.onChange}
          />
          <span>{label}</span>
        </label>
      </li>
    )
  }
}

const DeepSearchModal = ({ scopes, onToggleScope, onClose, getComponent }) => {
  const CloseIcon = getComponent("CloseIcon")

  return (
    <div className="dialog-ux deep-search-modal">
      <div className="backdrop-ux" onClick={onClose} role="presentation" />
      <div className="modal-ux">
        <div className="modal-dialog-ux">
          <div className="modal-ux-inner">
            <div className="modal-ux-header">
              <h3>Search scope</h3>
              <button type="button" className="close-modal" onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-ux-content">
              <p className="deep-search-modal-description">
                Choose which OpenAPI structures are included in search.
              </p>
              <ul className="deep-search-scope-list">
                {ALL_SCOPE_KEYS.map((scopeKey) => (
                  <ScopeCheckbox
                    key={scopeKey}
                    scopeKey={scopeKey}
                    checked={!!scopes[scopeKey]}
                    label={SEARCH_SCOPE_DEFINITIONS[scopeKey].label}
                    onToggleScope={onToggleScope}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DeepSearchModal.propTypes = {
  scopes: PropTypes.object.isRequired,
  onToggleScope: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default DeepSearchModal
