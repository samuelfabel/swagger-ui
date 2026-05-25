# `deepSearch` parameter

Swagger UI includes an optional Deep Search plugin that extends filtering beyond tag names. When enabled, a search input appears in the operations area and matches content across OpenAPI structures such as paths, summaries, parameters, request bodies, responses, and more.

The legacy [`filter`](configuration.md#user-content-filter) option filters by tag name only. Deep Search can replace that input when enabled, while remaining compatible with the existing filter pipeline.

## Usage

Add `deepSearch.enabled: true` to your Swagger UI configuration:

```javascript
SwaggerUI({
  url: "https://petstore.swagger.io/v2/swagger.json",
  deepSearch: {
    enabled: true,
    allowRuntimeScopeSelection: true,
  },
})
```

When `deepSearch.enabled` is `true`, the Deep Search input is shown in the filter region. You do not need to set `filter: true` unless you also want the legacy tag filter behavior.

## Configuration

The `deepSearch` option is an object with the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `Boolean` | `false` | Enables the Deep Search system. When `false`, Swagger UI behaves as before. |
| `allowRuntimeScopeSelection` | `Boolean` | `true` | When `true`, shows a scope selector button beside the search input so users can toggle searchable categories at runtime. When `false`, scopes are fixed by configuration and the selector is hidden. |
| `scopes` | `Array` or `null` | `null` | Optional list of scope keys to enable. When omitted or `null`, built-in defaults are used. When provided, only listed scopes are enabled. |

### Scope resolution

**When `allowRuntimeScopeSelection` is `true`**

- `scopes` defines the **initial** set of enabled scopes.
- Users may change scopes in the Search scope modal during the session.

**When `allowRuntimeScopeSelection` is `false`**

- `scopes` defines the **immutable** set of enabled scopes.
- The scope selector button and modal are not rendered.

### Example: locked-down portal

```javascript
SwaggerUI({
  deepSearch: {
    enabled: true,
    allowRuntimeScopeSelection: false,
    scopes: ["paths", "parameters", "responses", "descriptions"],
  },
})
```

### Example: enterprise defaults with runtime control

```javascript
SwaggerUI({
  deepSearch: {
    enabled: true,
    allowRuntimeScopeSelection: true,
    scopes: ["paths", "summaries", "parameters", "operationId"],
  },
})
```

## Searchable scopes

Each scope key controls which OpenAPI structures are indexed and searched.

| Scope key | Enabled by default | Description |
| --- | --- | --- |
| `paths` | yes | Operation path strings |
| `tags` | yes | Operation tags |
| `summaries` | yes | Operation summaries |
| `descriptions` | yes | Operation descriptions |
| `parameters` | yes | Parameter names, descriptions, and schema fields |
| `requestBodyFields` | yes | Request body fields (OAS3) and body parameters (Swagger 2) |
| `responseFields` | yes | Response descriptions and schema fields |
| `schemas` | no | Schema names and properties referenced by the operation |
| `examples` | no | Example values on parameters, request bodies, and responses |
| `statusCodes` | no | HTTP status codes on responses |
| `operationId` | yes | Operation IDs |

### Scope aliases

The following aliases are accepted in the `scopes` array:

| Alias | Resolves to |
| --- | --- |
| `responses` | `responseFields` |
| `requestBody` | `requestBodyFields` |

## Search behavior

- Search is **case insensitive**.
- Matching uses **partial text** within words and identifiers (for example, `cpf` matches `customerCpf`).
- Queries that match an **HTTP method name** (`get`, `post`, `put`, and so on) return all operations for that method, plus any additional text matches in enabled scopes.
- HTTP method queries use **strict word matching** in text fields to avoid false positives (for example, `post` does not match the word `positive`).
- The index is **pre-built** when the spec loads or when scopes change; search runs against the in-memory index rather than traversing the spec on every keystroke.
- Input is **debounced** (300ms) to reduce work while typing.
- Matching operations remain visible; non-matching operations are hidden, similar to the legacy filter.
- Deep Search does **not** auto-expand matched operations.

## Relationship to `filter`

| Option | Behavior |
| --- | --- |
| `filter: false`, `deepSearch.enabled: false` | No search input (default) |
| `filter: true`, `deepSearch.enabled: false` | Legacy tag filter input |
| `deepSearch.enabled: true` | Deep Search input (independent of `filter`) |

When both legacy filtering and Deep Search are active, tagged operations are filtered by tag first, then by Deep Search matches.

## Plugin registration

Deep Search is included in the default Swagger UI preset and does not need to be registered manually for standard installations.

To register it explicitly (for example, when building a custom preset):

```javascript
SwaggerUI({
  presets: [SwaggerUI.presets.apis],
  plugins: [SwaggerUI.plugins.DeepSearch],
  deepSearch: { enabled: true },
})
```

When using the standalone bundle, `SwaggerUIBundle.plugins.DeepSearch` is equivalent.
