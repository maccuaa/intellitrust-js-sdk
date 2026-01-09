# @maccuaa/intellitrust-issuance-sdk

[![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk)](https://www.npmjs.com/package/@maccuaa/intellitrust-issuance-sdk)
[![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk)](https://www.npmjs.com/package/@maccuaa/intellitrust-issuance-sdk)

TypeScript SDK for the Entrust Identity as a Service (IDaaS) Issuance API (formerly Entrust Adaptive Issuance Instant ID).

> **Note**: This is an unofficial community-maintained SDK, not an official Entrust product.

## Features

- 🎯 **Fully Typed**: Complete TypeScript definitions for all API operations
- 🚀 **Modern ESM**: Built for modern JavaScript environments
- 📦 **Tree-shakeable**: Import only the functions you need
- 🔒 **Type-safe**: Discriminated union types for response handling
- 🪶 **Lightweight**: Minimal runtime dependencies

## Installation

```bash
npm install @maccuaa/intellitrust-issuance-sdk
```

```bash
bun add @maccuaa/intellitrust-issuance-sdk
```

## Quick Start

```typescript
import {
  authenticateAdminApiUsingPost,
  listAdminApiApplicationsUsingGet,
} from "@maccuaa/intellitrust-issuance-sdk";

const baseUrl = "https://customer.region.trustedauth.com";

// Step 1: Authenticate to get auth token
const authResponse = await authenticateAdminApiUsingPost(
  {
    adminApiAuthentication: {
      applicationId: "your-app-id",
      sharedSecret: "your-shared-secret",
    },
  },
  { baseUrl }
);

if (authResponse.status === 200) {
  const authToken = authResponse.data.authToken;

  // Step 2: Use auth token for subsequent requests
  const appsResponse = await listAdminApiApplicationsUsingGet({
    baseUrl,
    headers: {
      Authorization: authToken,
    },
  });

  if (appsResponse.status === 200) {
    console.log("Applications:", appsResponse.data);
  }
}
```

## Response Handling

The SDK uses discriminated union types for type-safe response handling:

```typescript
const response = await authenticateAdminApiUsingPost(
  {
    adminApiAuthentication: {
      applicationId: "app-id",
      sharedSecret: "secret",
    },
  },
  { baseUrl }
);

// Type guard with status check
if (response.status === 200) {
  // response.data is now typed as AdminApiAuthenticationResult
  console.log("Auth token:", response.data.authToken);
  console.log("Expires:", response.data.expirationTime);
} else if (response.status === 401) {
  // response.data is now typed as ErrorInfo
  console.log("Authentication failed:", response.data.errorMessage);
}
```

## Configuration

### Global Defaults

Set default options for all requests:

```typescript
import { defaults } from "@maccuaa/intellitrust-issuance-sdk";

defaults.baseUrl = "https://customer.region.trustedauth.com";

// Now you can call functions without specifying baseUrl each time
const response = await listAdminApiApplicationsUsingGet({
  headers: { Authorization: "auth-token" },
});
```

### Per-Request Options

Override defaults for individual requests:

```typescript
const response = await listAdminApiApplicationsUsingGet({
  baseUrl: "https://different.trustedauth.com",
  headers: {
    Authorization: "auth-token",
  },
});
```

## Common Operations

### Authentication

```typescript
import { authenticateAdminApiUsingPost } from "@maccuaa/intellitrust-issuance-sdk";

// Authenticate and get auth token
const authResponse = await authenticateAdminApiUsingPost(
  {
    adminApiAuthentication: {
      applicationId: "app-id",
      sharedSecret: "shared-secret",
      enableWebSession: true, // Optional: enable session cookie
    },
  },
  { baseUrl }
);

if (authResponse.status === 200) {
  const authToken = authResponse.data.authToken;

  // Store token for subsequent requests
  // Token expiration: authResponse.data.expirationTime
}
```

### Application Management

```typescript
import {
  listAdminApiApplicationsUsingGet,
  createAdminApiApplicationUsingPost,
  updateAdminApiApplicationUsingPut,
  deleteAdminApiApplicationUsingDelete,
} from "@maccuaa/intellitrust-issuance-sdk";

const headers = { Authorization: authToken };

// List all applications
const appsResponse = await listAdminApiApplicationsUsingGet({
  baseUrl,
  headers,
});

// Create new application
const createResponse = await createAdminApiApplicationUsingPost(
  {
    adminApiApplicationParms: {
      name: "My Issuance App",
      description: "Application for credential issuance",
      allowLongLivedToken: false,
    },
  },
  { baseUrl, headers }
);

// Update application
if (createResponse.status === 200) {
  await updateAdminApiApplicationUsingPut(
    {
      id: createResponse.data.id,
      adminApiApplicationParms: {
        name: "Updated App Name",
        description: "Updated description",
      },
    },
    { baseUrl, headers }
  );
}

// Delete application
await deleteAdminApiApplicationUsingDelete(
  { id: "app-id" },
  { baseUrl, headers }
);
```

### Enrollment Management

```typescript
import {
  createEnrollments,
  readEnrollments,
  updateEnrollments,
  deleteEnrollments,
} from "@maccuaa/intellitrust-issuance-sdk";

const headers = { Authorization: authToken };

// Create enrollment
const createResponse = await createEnrollments(
  {
    enrollmentApiPayload: {
      enrollmentDesignName: "EmployeeID",
      enrollmentData: [
        {
          employeeId: "EMP001",
          firstName: "John",
          lastName: "Doe",
          department: "Engineering",
        },
      ],
    },
  },
  { baseUrl, headers }
);

// Read enrollments with filtering
const readResponse = await readEnrollments(
  {
    readEnrollmentApiPayload: {
      enrollmentDesignName: "EmployeeID",
      filterCriteria: [{ field: "department", value: "Engineering" }],
      pageNumber: "1",
      pageSize: "50",
    },
  },
  { baseUrl, headers }
);

// Update enrollment
await updateEnrollments(
  {
    enrollmentApiPayload: {
      enrollmentDesignName: "EmployeeID",
      enrollmentData: [
        {
          employeeId: "EMP001",
          department: "Product",
        },
      ],
    },
  },
  { baseUrl, headers }
);

// Delete enrollments
await deleteEnrollments(
  {
    enrollmentApiPayload: {
      enrollmentDesignName: "EmployeeID",
      enrollmentData: [{ employeeId: "EMP001" }],
    },
  },
  { baseUrl, headers }
);
```

### Mobile FlashPass (Credential Issuance)

```typescript
import {
  issueMobileFlashPassBulkOperation,
  getMobileFlashPassRequestDetails,
} from "@maccuaa/intellitrust-issuance-sdk";

const headers = { Authorization: authToken };

// Issue credentials (bulk operation)
const issueResponse = await issueMobileFlashPassBulkOperation(
  {
    enrollmentMultiFlashPassApiRequestV1: {
      enrollmentDesignName: "EmployeeID",
      primaryKeys: ["EMP001", "EMP002", "EMP003"],
    },
  },
  { baseUrl, headers }
);

if (issueResponse.status === 200) {
  const operationId = issueResponse.data.id;

  // Check operation status
  const statusResponse = await getMobileFlashPassRequestDetails(
    { id: operationId },
    { baseUrl, headers }
  );

  if (statusResponse.status === 200) {
    console.log("Status:", statusResponse.data.state);
    console.log("Processed:", statusResponse.data.rowsProcessed);
    console.log("Failed:", statusResponse.data.rowsFailed);
  }
}
```

### Application Template Management

```typescript
import {
  listApplicationTemplatesUsingGet,
  getApplicationTemplateUsingGet,
} from "@maccuaa/intellitrust-issuance-sdk";

const headers = { Authorization: authToken };

// List all templates
const templatesResponse = await listApplicationTemplatesUsingGet({
  baseUrl,
  headers,
});

// Get specific template
const templateResponse = await getApplicationTemplateUsingGet(
  { id: "template-id" },
  { baseUrl, headers }
);

if (templateResponse.status === 200) {
  console.log("Template:", templateResponse.data.name);
  console.log("Type:", templateResponse.data.authenticationMethod);
}
```

## Bulk Operations

The SDK supports tracking bulk operations like credential issuance:

```typescript
import {
  issueMobileFlashPassBulkOperation,
  getMobileFlashPassRequestDetails,
  cancelMobileFlashPassBulkOperation,
} from "@maccuaa/intellitrust-issuance-sdk";

const headers = { Authorization: authToken };

// Start bulk operation
const operation = await issueMobileFlashPassBulkOperation(
  {
    enrollmentMultiFlashPassApiRequestV1: {
      /* ... */
    },
  },
  { baseUrl, headers }
);

if (operation.status === 200) {
  const operationId = operation.data.id;

  // Poll for status
  const checkStatus = async () => {
    const status = await getMobileFlashPassRequestDetails(
      { id: operationId },
      { baseUrl, headers }
    );

    if (status.status === 200) {
      const state = status.data.state;

      if (state === "COMPLETED") {
        console.log("Operation completed successfully");
      } else if (state === "FAILED") {
        console.log("Operation failed:", status.data.errorMessage);
      } else if (state === "PROCESSING") {
        // Continue polling
        setTimeout(checkStatus, 2000);
      }
    }
  };

  checkStatus();

  // Or cancel if needed
  // await cancelMobileFlashPassBulkOperation(
  //   { id: operationId },
  //   { baseUrl, headers }
  // );
}
```

## API Documentation

For detailed API documentation, refer to the official [Entrust IDaaS Issuance API documentation](https://entrust.us.trustedauth.com/help/developer/apis/issuance/openapi/).

## Requirements

- Node.js >= 22.12.0
- TypeScript >= 5.0 (for TypeScript projects)

## License

ISC

## Support

This is a community-maintained SDK. For issues or feature requests, please visit the [GitHub repository](https://github.com/maccuaa/intellitrust-js-sdk).

For official Entrust IDaaS support, contact Entrust directly.
