/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const SearchScopeSelector = ({ onOpen, allowRuntimeScopeSelection }) => {
  if (!allowRuntimeScopeSelection) {
    return null
  }

  return (
    <button
      type="button"
      className="deep-search-scope-btn"
      onClick={onOpen}
      aria-label="Configure search scope"
      title="Configure search scope"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-4.8 6.4V18a1 1 0 0 1-.55.9l-4 2A1 1 0 0 1 10 20v-6.8L5.2 5.6A1 1 0 0 1 6 4H4a1 1 0 0 1-1 1Zm2.2 2h13.6l-3.6 4.8a1 1 0 0 0-.2.6V18.3l-2-1V12.4a1 1 0 0 0-.2-.6L5.2 7Z"
        />
      </svg>
    </button>
  )
}

SearchScopeSelector.propTypes = {
  onOpen: PropTypes.func.isRequired,
  allowRuntimeScopeSelection: PropTypes.bool.isRequired,
}

export default SearchScopeSelector
