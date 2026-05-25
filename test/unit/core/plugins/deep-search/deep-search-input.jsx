/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import DeepSearchInput from "core/plugins/deep-search/components/DeepSearchInput"
import { Col } from "core/components/layout-utils"

describe("<DeepSearchInput/>", () => {
  const mockedProps = {
    specSelectors: {
      loadingStatus() {
        return "success"
      },
    },
    deepSearchSelectors: {
      currentQuery() {
        return ""
      },
      activeScopes() {
        return { paths: true }
      },
      isModalOpen() {
        return false
      },
    },
    deepSearchActions: {
      updateQuery: jest.fn(),
      setModalOpen: jest.fn(),
      toggleScope: jest.fn(),
    },
    getComponent: () => Col,
    getConfigs: () => ({
      deepSearch: {
        enabled: true,
        allowRuntimeScopeSelection: true,
      },
    }),
  }

  it("renders search input when enabled", () => {
    const wrapper = mount(<DeepSearchInput {...mockedProps} />)

    expect(wrapper.find("input.deep-search-input").length).toEqual(1)
    expect(wrapper.find("button.deep-search-scope-btn").length).toEqual(1)
  })

  it("hides scope selector when runtime selection is disabled", () => {
    const props = {
      ...mockedProps,
      getConfigs: () => ({
        deepSearch: {
          enabled: true,
          allowRuntimeScopeSelection: false,
        },
      }),
    }

    const wrapper = mount(<DeepSearchInput {...props} />)

    expect(wrapper.find("button.deep-search-scope-btn").length).toEqual(0)
  })
})
