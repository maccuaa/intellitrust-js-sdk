# Entrust Identity as a Service JavaScript SDK

[![Build](https://github.com/maccuaa/intellitrust-js-sdk/workflows/Build/badge.svg)](https://github.com/maccuaa/intellitrust-js-sdk/actions?query=workflow%3ABuild)

This repository generates the JavaScript SDKs for the Entrust Identity as a Service Administration and Authentication APIs.

Also included are the Entrust Issuance as a Service APIs.

These are not official SDKs, this is a community project.

- SDKs generated using [oazapfts](https://www.npmjs.com/package/oazapfts)
- Functional API pattern with discriminated union types
- Includes full TypeScript definitions

## Docs

The instructions for installing and using the SDKs are published with the NPM package. See the SDK doc links below.

|                | Documentation                                                                         | SDK                                                                     | Badges                                                                                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Administration | [API](https://entrust.us.trustedauth.com/help/developer/apis/administration/openapi/) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk)    | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)             |
| Authentication | [API](https://entrust.us.trustedauth.com/help/developer/apis/authentication/openapi/) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)     | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)                 |
| Issuance       | [API](https://entrust.us.trustedauth.com/help/developer/apis/issuance/openapi/)       | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-issuance-sdk) | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk) |

## Available Commands

### Download OpenAPI Specs

```bash
bun run download
```

Fetches the latest OpenAPI specifications from Entrust IDaaS APIs.

### Generate SDKs

```bash
bun run build
```

Generates TypeScript SDK code from OpenAPI specs, bundles to ESM, and creates type declarations.

### Validate SDKs

```bash
bun run validate
```

Runs validation checks on generated packages using publint and @arethetypeswrong/cli.

### Lint & Format

```bash
bun run lint:fix
```

Applies Biome code formatting and linting rules.

### Test

```bash
bun test
```

Runs end-to-end tests against the SDKs.

## Publishing

Packages are automatically published to NPM when a GitHub Release is created for a git tag.

### Release Process

1. Create a git tag matching the IDaaS release version:

   ```bash
   git tag v5.XX
   git push --tags
   ```

2. Create a GitHub Release for the tag

The GitHub Actions workflow will automatically:

- Build all SDK packages
- Create tarballs with resolved dependencies
- Publish to NPM with OIDC trusted publishing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development details.
