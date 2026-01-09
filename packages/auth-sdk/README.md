# @maccuaa/intellitrust-auth-sdk

[![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk)](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)
[![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)

TypeScript SDK for the Entrust Identity as a Service (IDaaS) Authentication API.

> **Note**: This is an unofficial community-maintained SDK, not an official Entrust product.

## Features

- 🎯 **Fully Typed**: Complete TypeScript definitions for all API operations
- 🚀 **Modern ESM**: Built for modern JavaScript environments
- 📦 **Tree-shakeable**: Import only the functions you need
- 🔒 **Type-safe**: Discriminated union types for response handling
- 🪶 **Lightweight**: Minimal runtime dependencies

## Installation

```bash
npm install @maccuaa/intellitrust-auth-sdk
```

```bash
bun add @maccuaa/intellitrust-auth-sdk
```

## Quick Start

```typescript
import {
  userChallengeUsingPost,
  userAuthenticateUsingPost,
} from "@maccuaa/intellitrust-auth-sdk";

const baseUrl = "https://customer.region.trustedauth.com";

// Step 1: Request authentication challenge
const challengeResponse = await userChallengeUsingPost(
  {
    authenticator: "TOKEN",
    userChallengeParameters: {
      userId: "john.doe",
      applicationId: "app-id",
    },
  },
  { baseUrl }
);

if (challengeResponse.status === 200) {
  const authToken = challengeResponse.data.token;

  // Step 2: Complete authentication with OTP
  const authResponse = await userAuthenticateUsingPost(
    {
      authenticator: "TOKEN",
      authorization: authToken,
      userAuthenticateParameters: {
        userId: "john.doe",
        applicationId: "app-id",
        response: "123456", // OTP code
      },
    },
    { baseUrl }
  );

  if (
    authResponse.status === 200 &&
    authResponse.data.authenticationCompleted
  ) {
    console.log("Authentication successful!");
  }
}
```

## Response Handling

The SDK uses discriminated union types for type-safe response handling:

```typescript
const response = await userAuthenticatorQueryUsingPost(
  {
    userAuthenticateQueryParameters: {
      userId: "john.doe",
      applicationId: "app-id",
    },
  },
  { baseUrl }
);

// Type guard with status check
if (response.status === 200) {
  // response.data is now typed as UserAuthenticateQueryResponse
  console.log("User authenticators:", response.data.authenticators);
} else if (response.status === 404) {
  // response.data is now typed as ErrorInfo
  console.log("Error:", response.data.errorMessage);
}
```

## Configuration

### Global Defaults

Set default options for all requests:

```typescript
import { defaults } from "@maccuaa/intellitrust-auth-sdk";

defaults.baseUrl = "https://customer.region.trustedauth.com";

// Now you can call functions without specifying baseUrl each time
const response = await userAuthenticatorQueryUsingPost({
  userAuthenticateQueryParameters: {
    userId: "john.doe",
    applicationId: "app-id",
  },
});
```

### Per-Request Options

Override defaults for individual requests:

```typescript
const response = await userAuthenticateUsingPost(
  {
    authenticator: "PASSWORD",
    userAuthenticateParameters: {
      userId: "john.doe",
      applicationId: "app-id",
      response: "password123",
    },
  },
  {
    baseUrl: "https://different.trustedauth.com",
    headers: { "Custom-Header": "value" },
  }
);
```

## Authentication Flows

### Token (OTP) Authentication

```typescript
import {
  userChallengeUsingPost,
  userAuthenticateUsingPost,
} from "@maccuaa/intellitrust-auth-sdk";

// Request challenge
const challenge = await userChallengeUsingPost(
  {
    authenticator: "TOKEN",
    userChallengeParameters: {
      userId: "user@example.com",
      applicationId: "app-id",
    },
  },
  { baseUrl }
);

if (challenge.status === 200) {
  // Complete authentication with OTP
  const auth = await userAuthenticateUsingPost(
    {
      authenticator: "TOKEN",
      authorization: challenge.data.token,
      userAuthenticateParameters: {
        userId: "user@example.com",
        applicationId: "app-id",
        response: "123456",
      },
    },
    { baseUrl }
  );
}
```

### Password Authentication

```typescript
const response = await userAuthenticateUsingPost(
  {
    authenticator: "PASSWORD",
    userAuthenticateParameters: {
      userId: "user@example.com",
      applicationId: "app-id",
      response: "securePassword123",
    },
  },
  { baseUrl }
);

if (response.status === 200 && response.data.authenticationCompleted) {
  console.log("Login successful");
}
```

### FIDO Authentication

```typescript
import {
  userChallengeUsingPost,
  userAuthenticateUsingPost,
} from "@maccuaa/intellitrust-auth-sdk";

// Request FIDO challenge
const challenge = await userChallengeUsingPost(
  {
    authenticator: "FIDO",
    userChallengeParameters: {
      userId: "user@example.com",
      applicationId: "app-id",
    },
  },
  { baseUrl }
);

if (challenge.status === 200 && challenge.data.fido) {
  // Process FIDO challenge and get credential response
  const fidoResponse = {
    authenticatorData: "...",
    clientDataJSON: "...",
    credentialId: "...",
    signature: "...",
  };

  // Complete FIDO authentication
  const auth = await userAuthenticateUsingPost(
    {
      authenticator: "FIDO",
      authorization: challenge.data.token,
      userAuthenticateParameters: {
        userId: "user@example.com",
        applicationId: "app-id",
        fido: fidoResponse,
      },
    },
    { baseUrl }
  );
}
```

### Query Available Authenticators

```typescript
import { userAuthenticatorQueryUsingPost } from "@maccuaa/intellitrust-auth-sdk";

const response = await userAuthenticatorQueryUsingPost(
  {
    userAuthenticateQueryParameters: {
      userId: "user@example.com",
      applicationId: "app-id",
    },
  },
  { baseUrl }
);

if (response.status === 200) {
  console.log("Available authenticators:", response.data.authenticators);
}
```

## FIDO Token Management

### Register FIDO Token

```typescript
import {
  startFidoRegisterUsingGet,
  completeFidoRegisterUsingPost,
} from "@maccuaa/intellitrust-auth-sdk";

// Start FIDO registration
const startResponse = await startFidoRegisterUsingGet({ baseUrl });

if (startResponse.status === 200) {
  const challenge = startResponse.data;

  // Process challenge with WebAuthn API and get credential
  const credential = {
    attestationObject: "...",
    clientDataJSON: "...",
  };

  // Complete registration
  const completeResponse = await completeFidoRegisterUsingPost(
    {
      fidoRegisterResponse: credential,
    },
    { baseUrl }
  );

  if (completeResponse.status === 200) {
    console.log("FIDO token registered:", completeResponse.data);
  }
}
```

### Manage FIDO Tokens

```typescript
import {
  getSelfFidoTokenUsingGet,
  updateSelfFidoTokenUsingPut,
  deleteSelfFidoTokenUsingDelete,
} from "@maccuaa/intellitrust-auth-sdk";

// Get token details
const token = await getSelfFidoTokenUsingGet(
  { tokenid: "token-id" },
  { baseUrl }
);

// Update token
await updateSelfFidoTokenUsingPut(
  {
    tokenid: "token-id",
    fidoTokenParms: { label: "My Security Key" },
  },
  { baseUrl }
);

// Delete token
await deleteSelfFidoTokenUsingDelete({ tokenid: "token-id" }, { baseUrl });
```

## Supported Authenticators

- `PASSWORD` - Password authentication
- `TOKEN` - OTP tokens (soft tokens, hardware tokens)
- `FIDO` - FIDO/WebAuthn
- `PASSKEY` - Passkeys
- `MACHINE` - Device authentication
- `GRID` - Grid card authentication
- `KBA` - Knowledge-based authentication
- `OTP` - One-time passwords
- `EXTERNAL` - External identity provider
- `IDP` - Identity provider
- `USER_CERTIFICATE` - Certificate-based authentication
- And more...

## API Documentation

For detailed API documentation, refer to the official [Entrust IDaaS Authentication API documentation](https://entrust.us.trustedauth.com/help/developer/apis/authentication/openapi/).

## Requirements

- Node.js >= 22.12.0
- TypeScript >= 5.0 (for TypeScript projects)

## License

ISC

## Support

This is a community-maintained SDK. For issues or feature requests, please visit the [GitHub repository](https://github.com/maccuaa/intellitrust-js-sdk).

For official Entrust IDaaS support, contact Entrust directly.
