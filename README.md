# Entrust Identity as a Service JavaScript SDK

[![Build](https://github.com/maccuaa/intellitrust-js-sdk/workflows/Build/badge.svg)](https://github.com/maccuaa/intellitrust-js-sdk/actions?query=workflow%3ABuild)

Unofficial JavaScript/TypeScript SDKs for the Entrust Identity as a Service (IDaaS) APIs.

- **Functional API** with discriminated union types for type-safe response handling
- **Full TypeScript definitions** included in all packages
- **ESM-only** for modern JavaScript environments
- **Tree-shakeable** - import only what you need
- **Lightweight** - uses `@oazapfts/runtime` as HTTP client

> ⚠️ **Breaking Change (v5.43+)**: SDKs were rewritten using `oazapfts`. See [5.43 Release Notes](https://github.com/maccuaa/intellitrust-js-sdk/releases/tag/v5.43) for migration guide.

## SDKs

|                | API Docs                                                                               | NPM Package                                                                                            | Badges                                                                                                                                                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Administration | [Docs](https://entrust.us.trustedauth.com/help/developer/apis/administration/openapi/) | [@maccuaa/intellitrust-admin-sdk](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk)       | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)             |
| Authentication | [Docs](https://entrust.us.trustedauth.com/help/developer/apis/authentication/openapi/) | [@maccuaa/intellitrust-auth-sdk](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)         | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)                 |
| Issuance       | [Docs](https://entrust.us.trustedauth.com/help/developer/apis/issuance/openapi/)       | [@maccuaa/intellitrust-issuance-sdk](https://www.npmjs.com/package/@maccuaa/intellitrust-issuance-sdk) | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk) |

## Development

```bash
bun run download   # Fetch latest OpenAPI specs
bun run build      # Generate SDKs from specs
bun run validate   # Validate package exports
bun run lint:fix   # Format code with Biome
bun test           # Run tests
```

## Publishing

Packages are automatically published to NPM when OpenAPI specs are updated on the master branch. The workflow:

1. Detects changes to `openapi/**` files
2. Extracts the IDaaS version from the spec
3. Builds and publishes all SDK packages
4. Creates a GitHub Release

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development details.
