/**
 * @prettier
 */
import { fuzzyScore, searchEntries } from "core/plugins/deep-search/utils/search-engine"

describe("deep-search search-engine", () => {
  const entries = [
    {
      type: "paths",
      path: "/users/{id}",
      method: "get",
      operationId: "getUser",
      tags: ["user"],
      text: "/users/{id}",
      weight: 10,
    },
    {
      type: "parameters",
      path: "/users/{id}",
      method: "get",
      operationId: "getUser",
      tags: ["user"],
      text: "customerCpf cpf identifier",
      weight: 8,
    },
  ]

  const activeScopes = {
    paths: true,
    parameters: true,
    tags: false,
    summaries: false,
    descriptions: false,
    requestBodyFields: false,
    responseFields: false,
    schemas: false,
    examples: false,
    statusCodes: false,
    operationId: false,
  }

  it("should match partial case-insensitive queries", () => {
    const results = searchEntries(entries, "CPF", activeScopes)

    expect(results.has("get:/users/{id}")).toBe(true)
  })

  it("should return null for empty queries", () => {
    expect(searchEntries(entries, "", activeScopes)).toBe(null)
  })

  it("should not match unrelated words via subsequence letters", () => {
    expect(fuzzyScore("positive", "post")).toBe(0)
    expect(
      fuzzyScore(
        "For valid response try integer IDs with positive integer value",
        "post"
      )
    ).toBe(0)
  })

  it("should not match unrelated text via cross-word subsequence", () => {
    expect(
      fuzzyScore(
        "Status values that need to be considered for filter",
        "upload"
      )
    ).toBe(0)
  })

  it("should ignore disabled scopes", () => {
    const results = searchEntries(entries, "cpf", {
      ...activeScopes,
      parameters: false,
    })

    expect(results).toEqual(new Map())
  })

  it("should match operations by HTTP method name", () => {
    const methodEntries = [
      {
        type: "summaries",
        path: "/pet",
        method: "post",
        operationId: "addPet",
        tags: ["pet"],
        text: "Add a new pet to the store",
        weight: 7,
      },
      {
        type: "summaries",
        path: "/pet/{petId}",
        method: "put",
        operationId: "updatePet",
        tags: ["pet"],
        text: "Updates a pet in the store with form data",
        weight: 7,
      },
      {
        type: "summaries",
        path: "/pet/findByTags",
        method: "get",
        operationId: "findPetsByTags",
        tags: ["pet"],
        text: "Finds Pets by tags",
        weight: 7,
      },
    ]

    expect(searchEntries(methodEntries, "post", activeScopes).has("post:/pet")).toBe(
      true
    )
    expect(
      searchEntries(methodEntries, "put", activeScopes).has("put:/pet/{petId}")
    ).toBe(true)
    expect(
      searchEntries(methodEntries, "get", activeScopes).has(
        "get:/pet/findByTags"
      )
    ).toBe(true)
  })

  it("should not match HTTP method queries inside unrelated words", () => {
    expect(fuzzyScore("Invalid input", "put", { strict: true })).toBe(0)
    expect(fuzzyScore("forget password", "get", { strict: true })).toBe(0)
    expect(fuzzyScore("getPetById", "get", { strict: true })).toBeGreaterThan(0)
  })
})
