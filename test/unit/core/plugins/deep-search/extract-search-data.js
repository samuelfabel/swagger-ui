/**
 * @prettier
 */
import extractSearchEntries from "core/plugins/deep-search/utils/extract-search-data"
import petstore from "../spec/assets/petstore.json"

describe("deep-search extract-search-data", () => {
  const activeScopes = {
    paths: true,
    tags: true,
    summaries: true,
    descriptions: true,
    parameters: true,
    requestBodyFields: true,
    responseFields: true,
    schemas: true,
    examples: true,
    statusCodes: true,
    operationId: true,
  }

  it("should extract entries from a valid spec", () => {
    const entries = extractSearchEntries(petstore, activeScopes)

    expect(entries.length).toBeGreaterThan(0)
    expect(entries.some((entry) => entry.type === "paths")).toBe(true)
    expect(entries.some((entry) => entry.type === "operationId")).toBe(true)
  })

  it("should return an empty list for malformed specs", () => {
    expect(extractSearchEntries(null, activeScopes)).toEqual([])
    expect(extractSearchEntries({}, activeScopes)).toEqual([])
  })

  it("should extract nested schema property names", () => {
    const spec = {
      paths: {
        "/items": {
          post: {
            tags: ["items"],
            operationId: "createItem",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      sku: { type: "string" },
                      nested: {
                        properties: {
                          serialNumber: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "created",
              },
            },
          },
        },
      },
    }

    const entries = extractSearchEntries(spec, activeScopes)
    const requestEntry = entries.find(
      (entry) => entry.type === "requestBodyFields" && entry.path === "/items"
    )

    expect(requestEntry.text).toContain("serialNumber")
  })
})
