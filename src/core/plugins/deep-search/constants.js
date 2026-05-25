/**
 * @prettier
 */

/**
 * HTTP methods recognized by OpenAPI/Swagger UI operation indexing.
 *
 * @type {string[]}
 */
export const OPERATION_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query",
]

export const SEARCH_SCOPE_DEFINITIONS = {
  paths: {
    key: "paths",
    label: "Paths",
    defaultEnabled: true,
    weight: 10,
  },
  tags: {
    key: "tags",
    label: "Tags",
    defaultEnabled: true,
    weight: 6,
  },
  summaries: {
    key: "summaries",
    label: "Summaries",
    defaultEnabled: true,
    weight: 7,
  },
  descriptions: {
    key: "descriptions",
    label: "Descriptions",
    defaultEnabled: true,
    weight: 5,
  },
  parameters: {
    key: "parameters",
    label: "Parameters",
    defaultEnabled: true,
    weight: 8,
  },
  requestBodyFields: {
    key: "requestBodyFields",
    label: "Request Body Fields",
    defaultEnabled: true,
    weight: 8,
  },
  responseFields: {
    key: "responseFields",
    label: "Response Fields",
    defaultEnabled: true,
    weight: 7,
  },
  schemas: {
    key: "schemas",
    label: "Schemas",
    defaultEnabled: false,
    weight: 4,
  },
  examples: {
    key: "examples",
    label: "Examples",
    defaultEnabled: false,
    weight: 3,
  },
  statusCodes: {
    key: "statusCodes",
    label: "Status Codes",
    defaultEnabled: false,
    weight: 5,
  },
  operationId: {
    key: "operationId",
    label: "operationId",
    defaultEnabled: true,
    weight: 9,
  },
}

export const SCOPE_ALIASES = {
  responses: "responseFields",
  requestBody: "requestBodyFields",
}

export const ALL_SCOPE_KEYS = Object.keys(SEARCH_SCOPE_DEFINITIONS)

export const DEFAULT_SCOPES = ALL_SCOPE_KEYS.reduce((acc, key) => {
  acc[key] = SEARCH_SCOPE_DEFINITIONS[key].defaultEnabled
  return acc
}, {})

export const resolveScopeKey = (scope) => SCOPE_ALIASES[scope] || scope

/**
 * Resolves the initial scope map from Deep Search configuration.
 *
 * When `scopes` is a non-empty array, only listed scopes are enabled.
 * Otherwise, {@link DEFAULT_SCOPES} is used.
 *
 * @param {Object} [deepSearchConfig={}]
 * @param {string[]|null} [deepSearchConfig.scopes]
 * @returns {Object<string, boolean>}
 */
export const resolveInitialScopes = (deepSearchConfig = {}) => {
  const configScopes = deepSearchConfig.scopes

  if (Array.isArray(configScopes) && configScopes.length > 0) {
    const enabledKeys = new Set(configScopes.map(resolveScopeKey))

    return ALL_SCOPE_KEYS.reduce((acc, key) => {
      acc[key] = enabledKeys.has(key)
      return acc
    }, {})
  }

  return { ...DEFAULT_SCOPES }
}
