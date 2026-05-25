/**
 * @prettier
 */
import { OPERATION_METHODS, SEARCH_SCOPE_DEFINITIONS } from "../constants"

const MAX_SCHEMA_DEPTH = 10

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value)

const collectText = (value) => {
  if (value === null || value === undefined) {
    return ""
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(collectText).filter(Boolean).join(" ")
  }

  if (isPlainObject(value)) {
    return Object.values(value).map(collectText).filter(Boolean).join(" ")
  }

  return ""
}

const collectSchemaTexts = (schema, depth = 0, seen = new Set()) => {
  if (!isPlainObject(schema) || depth > MAX_SCHEMA_DEPTH) {
    return []
  }

  const ref = schema.$ref
  if (ref && seen.has(ref)) {
    return []
  }

  if (ref) {
    seen.add(ref)
  }

  const texts = []

  if (schema.title) texts.push(schema.title)
  if (schema.description) texts.push(schema.description)

  if (isPlainObject(schema.properties)) {
    Object.entries(schema.properties).forEach(([name, propertySchema]) => {
      texts.push(name)
      texts.push(...collectSchemaTexts(propertySchema, depth + 1, seen))
    })
  }

  if (schema.items) {
    texts.push(...collectSchemaTexts(schema.items, depth + 1, seen))
  }

  ;["allOf", "oneOf", "anyOf"].forEach((keyword) => {
    if (Array.isArray(schema[keyword])) {
      schema[keyword].forEach((subSchema) => {
        texts.push(...collectSchemaTexts(subSchema, depth + 1, seen))
      })
    }
  })

  return texts
}

const createEntry = (base, type, text) => {
  const normalizedText = collectText(text).trim()

  if (!normalizedText) {
    return null
  }

  return {
    type,
    path: base.path,
    method: base.method,
    operationId: base.operationId,
    tags: base.tags,
    text: normalizedText,
    weight: SEARCH_SCOPE_DEFINITIONS[type]?.weight || 1,
  }
}

const extractParameters = (operation, base, activeScopes, entries) => {
  if (!activeScopes.parameters || !Array.isArray(operation.parameters)) {
    return
  }

  operation.parameters.forEach((parameter) => {
    if (!isPlainObject(parameter)) {
      return
    }

    const parts = [parameter.name, parameter.description, parameter.in]

    if (parameter.schema) {
      parts.push(...collectSchemaTexts(parameter.schema))
    }

    const entry = createEntry(base, "parameters", parts.join(" "))
    if (entry) entries.push(entry)
  })
}

const extractRequestBody = (operation, base, activeScopes, entries) => {
  if (!activeScopes.requestBodyFields) {
    return
  }

  const requestBody = operation.requestBody

  if (!isPlainObject(requestBody)) {
    // Swagger 2 body parameter
    if (Array.isArray(operation.parameters)) {
      operation.parameters
        .filter((parameter) => parameter.in === "body")
        .forEach((parameter) => {
          const parts = [parameter.name, parameter.description]
          if (parameter.schema) {
            parts.push(...collectSchemaTexts(parameter.schema))
          }
          const entry = createEntry(base, "requestBodyFields", parts.join(" "))
          if (entry) entries.push(entry)
        })
    }
    return
  }

  const parts = [requestBody.description]

  if (isPlainObject(requestBody.content)) {
    Object.values(requestBody.content).forEach((mediaType) => {
      if (isPlainObject(mediaType) && mediaType.schema) {
        parts.push(...collectSchemaTexts(mediaType.schema))
      }
    })
  }

  const entry = createEntry(base, "requestBodyFields", parts.join(" "))
  if (entry) entries.push(entry)
}

const extractResponses = (operation, base, activeScopes, entries) => {
  if (!isPlainObject(operation.responses)) {
    return
  }

  Object.entries(operation.responses).forEach(([statusCode, response]) => {
    if (!isPlainObject(response)) {
      return
    }

    if (activeScopes.statusCodes) {
      const statusEntry = createEntry(base, "statusCodes", statusCode)
      if (statusEntry) entries.push(statusEntry)
    }

    if (activeScopes.responseFields) {
      const parts = [response.description]

      if (isPlainObject(response.content)) {
        Object.values(response.content).forEach((mediaType) => {
          if (isPlainObject(mediaType) && mediaType.schema) {
            parts.push(...collectSchemaTexts(mediaType.schema))
          }
        })
      }

      if (response.schema) {
        parts.push(...collectSchemaTexts(response.schema))
      }

      const entry = createEntry(base, "responseFields", parts.join(" "))
      if (entry) entries.push(entry)
    }
  })
}

const extractExamples = (operation, base, activeScopes, entries) => {
  if (!activeScopes.examples) {
    return
  }

  const exampleSources = []

  if (Array.isArray(operation.parameters)) {
    operation.parameters.forEach((parameter) => {
      if (parameter.example !== undefined) {
        exampleSources.push(parameter.example)
      }
      if (isPlainObject(parameter.examples)) {
        exampleSources.push(...Object.values(parameter.examples))
      }
      if (parameter.schema?.example !== undefined) {
        exampleSources.push(parameter.schema.example)
      }
    })
  }

  if (isPlainObject(operation.requestBody?.content)) {
    Object.values(operation.requestBody.content).forEach((mediaType) => {
      if (mediaType.example !== undefined) {
        exampleSources.push(mediaType.example)
      }
      if (isPlainObject(mediaType.examples)) {
        exampleSources.push(...Object.values(mediaType.examples))
      }
    })
  }

  if (isPlainObject(operation.responses)) {
    Object.values(operation.responses).forEach((response) => {
      if (isPlainObject(response?.content)) {
        Object.values(response.content).forEach((mediaType) => {
          if (mediaType.example !== undefined) {
            exampleSources.push(mediaType.example)
          }
          if (isPlainObject(mediaType.examples)) {
            exampleSources.push(...Object.values(mediaType.examples))
          }
        })
      }
      if (response?.examples) {
        exampleSources.push(response.examples)
      }
    })
  }

  const entry = createEntry(
    base,
    "examples",
    exampleSources.map(collectText).join(" ")
  )
  if (entry) entries.push(entry)
}

const collectRefsFromValue = (value, refs = new Set(), depth = 0) => {
  if (!value || depth > MAX_SCHEMA_DEPTH) {
    return refs
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectRefsFromValue(item, refs, depth + 1))
    return refs
  }

  if (!isPlainObject(value)) {
    return refs
  }

  if (typeof value.$ref === "string") {
    const refName = value.$ref.split("/").pop()
    if (refName) {
      refs.add(refName)
    }
  }

  Object.values(value).forEach((item) =>
    collectRefsFromValue(item, refs, depth + 1)
  )

  return refs
}

const getSchemaByName = (spec, schemaName) => {
  if (!schemaName) {
    return null
  }

  return (
    spec?.definitions?.[schemaName] ||
    spec?.components?.schemas?.[schemaName] ||
    null
  )
}

const extractOperationSchemas = (
  operation,
  spec,
  base,
  activeScopes,
  entries
) => {
  if (!activeScopes.schemas) {
    return
  }

  const refs = collectRefsFromValue(operation)
  const parts = []

  refs.forEach((refName) => {
    parts.push(refName)
    const schema = getSchemaByName(spec, refName)
    if (schema) {
      parts.push(...collectSchemaTexts(schema))
    }
  })

  const entry = createEntry(base, "schemas", parts.join(" "))
  if (entry) entries.push(entry)
}

export const extractSearchEntries = (spec, activeScopes) => {
  const entries = []

  if (!isPlainObject(spec) || !isPlainObject(spec.paths)) {
    return entries
  }

  Object.entries(spec.paths).forEach(([pathName, pathItem]) => {
    if (!isPlainObject(pathItem)) {
      return
    }

    OPERATION_METHODS.forEach((method) => {
      const operation = pathItem[method]

      if (!isPlainObject(operation)) {
        return
      }

      const tags = Array.isArray(operation.tags) ? operation.tags : []
      const base = {
        path: pathName,
        method,
        operationId: operation.operationId || `${method}-${pathName}`,
        tags,
      }

      if (activeScopes.paths) {
        const entry = createEntry(base, "paths", pathName)
        if (entry) entries.push(entry)
      }

      if (activeScopes.operationId && operation.operationId) {
        const entry = createEntry(base, "operationId", operation.operationId)
        if (entry) entries.push(entry)
      }

      if (activeScopes.summaries && operation.summary) {
        const entry = createEntry(base, "summaries", operation.summary)
        if (entry) entries.push(entry)
      }

      if (activeScopes.descriptions && operation.description) {
        const entry = createEntry(base, "descriptions", operation.description)
        if (entry) entries.push(entry)
      }

      if (activeScopes.tags && tags.length) {
        const entry = createEntry(base, "tags", tags.join(" "))
        if (entry) entries.push(entry)
      }

      extractParameters(operation, base, activeScopes, entries)
      extractRequestBody(operation, base, activeScopes, entries)
      extractResponses(operation, base, activeScopes, entries)
      extractExamples(operation, base, activeScopes, entries)
      extractOperationSchemas(operation, spec, base, activeScopes, entries)
    })
  })

  return entries
}

export default extractSearchEntries
