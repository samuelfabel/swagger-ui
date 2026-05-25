/**
 * @prettier
 */
import buildIndex from "core/plugins/deep-search/utils/build-index"

describe("deep-search build-index performance", () => {
  it("should build a large index in reasonable time", () => {
    const paths = {}

    for (let i = 0; i < 250; i += 1) {
      paths[`/resource/${i}`] = {
        get: {
          tags: [`tag-${i % 20}`],
          operationId: `getResource${i}`,
          summary: `Get resource ${i}`,
          description: `Detailed description for resource ${i}`,
          parameters: [
            {
              name: `param${i}`,
              in: "query",
              description: `Query parameter ${i}`,
            },
          ],
          responses: {
            200: {
              description: "Success",
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      [`field${i}`]: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      }
    }

    const spec = {
      openapi: "3.0.0",
      paths,
    }

    const activeScopes = {
      paths: true,
      tags: true,
      summaries: true,
      descriptions: true,
      parameters: true,
      requestBodyFields: true,
      responseFields: true,
      schemas: true,
      examples: false,
      statusCodes: true,
      operationId: true,
    }

    const start = Date.now()
    const index = buildIndex(spec, activeScopes)
    const elapsed = Date.now() - start

    expect(index.length).toBeGreaterThan(1000)
    expect(elapsed).toBeLessThan(2000)
  })
})
