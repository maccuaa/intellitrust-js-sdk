# Contributing

## Prerequisites

- **Bun** >= 1.3 (JavaScript runtime)
- **Node.js** >= 22.12.0 (for type checking in some tools)
- **Git** (for version control)

## Project Structure

This is a Bun workspace monorepo containing three SDK packages:

```
packages/
  ├── admin-sdk/          # Administration API SDK
  ├── auth-sdk/           # Authentication API SDK
  └── issuance-sdk/       # Issuance API SDK

bin/
  ├── generate.ts         # SDK generation orchestration
  ├── download.ts         # OpenAPI spec downloader
  ├── validate.ts         # Package validation
  ├── clean.ts            # Directory cleanup utility
  └── lib.ts              # Shared utilities

openapi/
  ├── administration.json  # Administration API spec
  ├── authentication.json  # Authentication API spec
  └── issuance.json        # Issuance API spec

tests/
  ├── admin.test.ts        # Admin SDK tests
  ├── auth.test.ts         # Auth SDK tests
  └── issuance.test.ts     # Issuance SDK tests
```

## SDK Architecture

The SDKs use a **functional API pattern** (not class-based) with:

- **Discriminated union types** for type-safe response handling
- **Runtime configuration** via `defaults` object from `@oazapfts/runtime`
- **Tree-shakeable exports** - import only what you need
- **ESM-only modules** - no CommonJS support

### Response Handling Example

```typescript
const response = await createUserUsingPost({ userParms }, { baseUrl, headers });

if (response.status === 200) {
  // response.data is typed as UserRead
  console.log(response.data);
} else if (response.status === 400) {
  // response.data is typed as ErrorInfo
  console.error(response.data.errorMessage);
}
```

## Development Workflow

### 1. Make Changes

Edit source files in `bin/` or package `README.md` files as needed.

### 2. Generate SDKs

```bash
bun run build
```

This will:

- Clean old generated code
- Generate TypeScript from OpenAPI specs
- Install dependencies for each package
- Bundle to ESM format
- Generate type declarations

### 3. Validate Changes

```bash
bun run validate
```

Checks package.json configuration and TypeScript type exports.

### 4. Lint & Format

```bash
bun run lint:fix
```

Applies consistent code formatting using Biome.

### 5. Run Tests

```bash
bun test
```

Executes end-to-end tests against the generated SDKs.

## Key Files

- **[AGENTS.md](./AGENTS.md)** - Detailed documentation for AI agents and automated systems
- **[biome.json](./biome.json)** - Linting and formatting configuration
- **[package.json](./package.json)** - Workspace configuration and dependency catalog
- **[tsconfig.json](./tsconfig.json)** - TypeScript configuration
- **[bunfig.toml](./bunfig.toml)** - Bun runtime configuration

## Important Notes

### Generated Code

Files like `packages/*/index.ts` are **generated** by `oazapfts`. Do not edit them directly. All changes should be made through:

1. Modifying the OpenAPI specification (if needed)
2. Updating generator scripts in `bin/`
3. Modifying README or configuration files

### Dependency Management

The project uses Bun's **workspace catalog** to centralize dependency versions:

- Update versions in root `package.json` catalog section
- Run `bun install` to apply changes
- All SDK packages reference catalog versions via `"catalog:"` protocol

### Isolated Installs

Bun uses **isolated installs** (default since 1.3) for strict dependency isolation:

- Prevents phantom dependencies
- Ensures deterministic builds
- Each package has its own `node_modules/`

## Testing SDKs

To test SDKs against actual APIs:

1. Set up credentials for your Entrust IDaaS environment
2. Update test files in `tests/` with your environment details
3. Run `bun test`

See individual test files for required environment variables.

## Troubleshooting

### Build Fails

- Verify OpenAPI specs exist in `./openapi/`
- Ensure specs are valid JSON/YAML
- Check that `oazapfts` is up to date: `bunx oazapfts --help`

### Validation Fails

- Ensure `dist/` directory exists in each package
- Verify `package.json` exports and files fields are correct
- Check that type definitions were generated in `dist/index.d.ts`

### Tests Fail

- Ensure you have valid credentials configured
- Check that the target APIs are accessible
- Verify the OpenAPI specs match your API version

## Questions?

See [AGENTS.md](./AGENTS.md) for comprehensive documentation about the project architecture, workflows, and common development tasks.
