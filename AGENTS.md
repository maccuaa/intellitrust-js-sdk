# AGENTS.md

## Project Overview

This repository generates JavaScript/TypeScript SDKs for Entrust Identity as a Service (IDaaS) APIs. It's a project that provides unofficial SDKs for:

- **Administration API** - Identity management and administration operations
- **Authentication API** - User authentication and authorization flows
- **Issuance API** - Credential issuance services

## Architecture

### Repository Structure

- **`packages/`** - Contains three generated SDK packages:
  - `admin-sdk/` - Administration API SDK
  - `auth-sdk/` - Authentication API SDK
  - `issuance-sdk/` - Issuance API SDK
- **`templates/`** - Mustache templates for SDK generation
- **`bin/`** - Build scripts (download OpenAPI specs, generate SDKs)
- **`tests/e2e/`** - End-to-end tests for each SDK

### Technology Stack

- **Runtime**: Bun (JavaScript/TypeScript runtime)
- **Code Generation**: OpenAPI Generator with custom Mustache templates
- **Linting**: Biome
- **Language**: TypeScript with type definitions
- **Package Manager**: Bun (with workspaces and isolated installs)

## Key Workflows

### SDK Generation Process

1. **Download OpenAPI Specifications**

   ```bash
   bun run download
   ```

   Fetches the latest OpenAPI JSON specs from Entrust IDaaS APIs

2. **Generate SDKs**

   ```bash
   bun run build
   ```

   Uses OpenAPI Generator with custom templates to create TypeScript SDK code

3. **Lint & Format**

   ```bash
   bun run lint:fix
   ```

   Applies Biome code formatting and linting rules

4. **Test**
   ```bash
   bun test
   ```
   Runs end-to-end tests against the SDKs

### Publishing Workflow

1. Create a git tag matching the IDaaS release version (e.g., `v5.XX`)
2. Push the tag to trigger GitHub Actions
3. Create a GitHub Release
4. Packages are published to NPM under `@maccuaa/intellitrust-*-sdk`

**Publishing Process:**

- Loops through each SDK package (admin-sdk, auth-sdk, issuance-sdk)
- Uses `bun pm pack` to create tarball with resolved catalog dependencies
- Publishes tarball via `npm publish` (provenance attestations are automatic with OIDC trusted publishing)
- Cleans up tarballs after publishing
- This approach maintains security while properly handling catalog references

## Important Files

- **`openapitools.json`** - OpenAPI Generator configuration
- **`biome.json`** - Linting and formatting rules
- **`package.json`** - Workspace and dependency configuration
- **`tsconfig.json`** - TypeScript configuration
- **`bin/generate.ts`** - SDK generation script
- **`bin/download.ts`** - OpenAPI spec download script

## Code Generation Templates

The `templates/` directory contains Mustache templates that customize the generated SDK code:

- `api.mustache` - API class templates
- `baseApi.mustache` - Base API class with common functionality
- `configuration.mustache` - SDK configuration
- `common.mustache` - Shared types and utilities
- `index.mustache` - Package entry points

## Guidelines for AI Agents

### When Making Changes

1. **SDK Code** (`packages/*/api.ts`, `base.ts`, etc.) - These are **GENERATED** files. Do not edit directly. Instead, modify the templates in `templates/` and regenerate.

2. **Templates** - Changes to `.mustache` files require regeneration to take effect. Always run `bun run build` after template modifications.

3. **OpenAPI Specs** - The `openapi.json` files in each package are downloaded from Entrust. Update via `bun run download`.

4. **Build Scripts** - Files in `bin/` control the generation process. Test thoroughly after modifications.

### Common Tasks

- **Add new API endpoint support**: Update happens automatically when OpenAPI specs are updated via `bun run download`
- **Customize generated code**: Modify the appropriate `.mustache` template and regenerate
- **Add new SDK package**: Would require updating `bin/generate.ts` and adding new package directory
- **Fix SDK bugs**: Check if the issue is in templates or in the OpenAPI spec itself

### Testing Changes

- Run `bun run build` to regenerate SDKs after template changes
- Run `bun test` to execute e2e tests
- Test changes with `bun run lint` before committing

### Dependency Management

This project uses Bun's **workspace catalogs** to centralize dependency versions:

- **Catalog dependencies**: `typescript` and `axios` versions are defined once in the root `package.json` catalog
- **Usage**: All SDK packages reference catalog versions using `"catalog:"` protocol
- **Benefits**: Single source of truth for versions, easier updates across all packages
- **Updating versions**: To update axios or typescript, modify the version in the root `package.json` catalog and run `bun install`

**Example catalog entry:**

```json
"workspaces": {
  "catalog": {
    "typescript": "^5.9.2",
    "axios": "1.12.2"
  }
}
```

**Important notes:**

- When publishing SDKs, the workflow uses `bun pm pack` to create tarballs (which resolves `"catalog:"` references to actual version numbers), then publishes those tarballs with `npm publish` to maintain OIDC trusted publishing support
- **Why this two-step process?** Bun's `bun pm pack` resolves catalog references, but `bun publish` doesn't support npm's OIDC trusted publishing (provenance attestations are automatic with `npm publish` when using trusted publishing)
- Keep Bun and OpenAPI Generator CLI up to date
- Monitor renovate.json for automated dependency updates

### Bun Isolated Installs

This project uses Bun's **isolated installs** (default since Bun 1.3) which provides strict dependency isolation similar to pnpm:

- **Benefits**: Prevents phantom dependencies, ensures deterministic builds, better workspace isolation
- **Build Process**: The `bin/generate.ts` script installs dependencies in each SDK package after code generation but before type checking
- **Type Checking**: Uses `bun x --bun tsc` to run TypeScript compiler with proper module resolution

**Important**: Do not switch to hoisted installs unless absolutely necessary. The build process is designed to work with isolated installs.

## Project Conventions

- Uses Bun workspaces for monorepo management
- NPM packages are scoped under `@maccuaa/`
- Follows semantic versioning aligned with Entrust IDaaS releases
- Community-maintained, not officially supported by Entrust

## Resources

- [Entrust IDaaS Documentation](https://entrust.us.trustedauth.com/help/developer/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Bun Runtime](https://bun.sh/)
