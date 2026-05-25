/**
 * @prettier
 */
import { resolveInitialScopes } from "core/plugins/deep-search/constants"

describe("deep-search constants", () => {
  it("should use default scopes when config scopes are not provided", () => {
    const scopes = resolveInitialScopes({})

    expect(scopes.paths).toBe(true)
    expect(scopes.schemas).toBe(false)
    expect(scopes.operationId).toBe(true)
  })

  it("should resolve scope aliases from config", () => {
    const scopes = resolveInitialScopes({
      scopes: ["paths", "responses", "descriptions"],
    })

    expect(scopes.paths).toBe(true)
    expect(scopes.responseFields).toBe(true)
    expect(scopes.descriptions).toBe(true)
    expect(scopes.parameters).toBe(false)
  })
})
