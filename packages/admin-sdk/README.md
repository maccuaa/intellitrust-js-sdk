# @maccuaa/intellitrust-admin-sdk

[![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk)](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk)
[![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk)

TypeScript SDK for the Entrust Identity as a Service (IDaaS) Administration API.

> **Note**: This is an unofficial community-maintained SDK, not an official Entrust product.

## Features

- 🎯 **Fully Typed**: Complete TypeScript definitions for all API operations
- 🚀 **Modern ESM**: Built for modern JavaScript environments
- 📦 **Tree-shakeable**: Import only the functions you need
- 🔒 **Type-safe**: Discriminated union types for response handling
- 🪶 **Lightweight**: Minimal runtime dependencies

## Installation

```bash
npm install @maccuaa/intellitrust-admin-sdk
```

```bash
bun add @maccuaa/intellitrust-admin-sdk
```

## Quick Start

```typescript
import {
  listAuthApiApplicationsUsingGet,
  createUserUsingPost,
} from "@maccuaa/intellitrust-admin-sdk";

// Configure your base URL and authentication headers
const baseUrl = "https://customer.region.trustedauth.com";
const headers = {
  Authorization: "applicationId,sharedSecret",
};

// List authentication API applications
const response = await listAuthApiApplicationsUsingGet({ baseUrl, headers });

if (response.status === 200) {
  console.log("Applications:", response.data);
}

// Create a new user
const createResponse = await createUserUsingPost(
  {
    userParms: {
      userId: "john.doe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
  },
  { baseUrl, headers }
);

if (createResponse.status === 200) {
  console.log("User created:", createResponse.data);
}
```

## Response Handling

The SDK uses discriminated union types for type-safe response handling:

```typescript
const response = await createTokenUsingPost(
  { userid: "user123", $type: "GOOGLE_AUTHENTICATOR" },
  { baseUrl, headers }
);

// Type guard with status check
if (response.status === 200) {
  // response.data is now typed as Token
  console.log("Token ID:", response.data.id);
} else if (response.status === 400) {
  // response.data is now typed as ErrorInfo
  console.log("Error:", response.data.errorMessage);
}
```

## Configuration

### Global Defaults

Set default options for all requests:

```typescript
import { defaults } from "@maccuaa/intellitrust-admin-sdk";

defaults.baseUrl = "https://customer.region.trustedauth.com";
defaults.headers = {
  Authorization: "applicationId,sharedSecret",
};

// Now you can call functions without specifying baseUrl/headers each time
const response = await listAuthApiApplicationsUsingGet();
```

### Per-Request Options

Override defaults for individual requests:

```typescript
const response = await listAuthApiApplicationsUsingGet({
  baseUrl: "https://different.trustedauth.com",
  headers: {
    Authorization: "different,credentials",
  },
});
```

## Common Operations

### User Management

```typescript
import {
  createUserUsingPost,
  userByUseridUsingPost,
  updateUserUsingPut,
  deleteUserUsingDelete,
} from "@maccuaa/intellitrust-admin-sdk";

// Get user by userId
const userResponse = await userByUseridUsingPost(
  { userGetParms: { userId: "john.doe" } },
  { baseUrl, headers }
);

// Update user
if (userResponse.status === 200) {
  await updateUserUsingPut(
    {
      id: userResponse.data.id,
      userParms: { email: "newemail@example.com" },
    },
    { baseUrl, headers }
  );
}

// Delete user
await deleteUserUsingDelete({ id: userResponse.data.id }, { baseUrl, headers });
```

### Token Management

```typescript
import {
  createTokenUsingPost,
  startActivateTokenUsingPost,
  deleteTokenUsingDelete,
} from "@maccuaa/intellitrust-admin-sdk";

// Create a Google Authenticator token
const tokenResponse = await createTokenUsingPost(
  {
    userid: "user-id",
    $type: "GOOGLE_AUTHENTICATOR",
    tokenCreateParms: {
      activateParms: { type: ["OFFLINE"] },
    },
  },
  { baseUrl, headers }
);

// Start token activation
if (tokenResponse.status === 200) {
  const activationResponse = await startActivateTokenUsingPost(
    {
      tokenid: tokenResponse.data.id,
      activateParms: {
        deliverActivationEmail: false,
        returnQRCode: true,
        type: ["OFFLINE"],
      },
    },
    { baseUrl, headers }
  );

  if (activationResponse.status === 200) {
    console.log("QR Code:", activationResponse.data.qrCode);
  }
}
```

### Application Management

```typescript
import {
  listAuthApiApplicationsUsingGet,
  createAuthApiApplicationUsingPost,
} from "@maccuaa/intellitrust-admin-sdk";

// List all auth API applications
const appsResponse = await listAuthApiApplicationsUsingGet({
  baseUrl,
  headers,
});

// Create new auth API application
const createAppResponse = await createAuthApiApplicationUsingPost(
  {
    authApiApplicationParms: {
      name: "My Application",
      description: "Application description",
    },
  },
  { baseUrl, headers }
);
```

## API Documentation

For detailed API documentation, refer to the official [Entrust IDaaS Administration API documentation](https://entrust.us.trustedauth.com/help/developer/apis/administration/openapi/).

## Requirements

- Node.js >= 22.12.0
- TypeScript >= 5.0 (for TypeScript projects)

## License

ISC

## Support

This is a community-maintained SDK. For issues or feature requests, please visit the [GitHub repository](https://github.com/maccuaa/intellitrust-js-sdk).

For official Entrust IDaaS support, contact Entrust directly.
