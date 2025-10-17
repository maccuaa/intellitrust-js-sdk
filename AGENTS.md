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
- **Package Manager**: Bun (with workspaces)

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

### Dependencies

- Keep Bun and OpenAPI Generator CLI up to date
- TypeScript version is managed via workspace catalog
- Monitor renovate.json for automated dependency updates

## Project Conventions

- Uses Bun workspaces for monorepo management
- NPM packages are scoped under `@maccuaa/`
- Follows semantic versioning aligned with Entrust IDaaS releases
- Community-maintained, not officially supported by Entrust

## Resources

- [Entrust IDaaS Documentation](https://entrust.us.trustedauth.com/help/developer/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Bun Runtime](https://bun.sh/)
