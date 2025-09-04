# @maccuaa/intellitrust-admin-sdk

This is a JavaScript client for the Entrust Identity as a Service  API. This module can be used in the following environments:

- Node.js
- Browser

It can be used in both TypeScript and JavaScript projects.

## Installation

```bash
npm install @maccuaa/intellitrust-admin-sdk --save
```

## Usage

**NOTE:** Make sure to replace the configuration values in the examples with the values from your Identity as a Service account!

```javascript
import { API } from "@maccuaa/intellitrust-admin-sdk";

const basePath = "https://entrust.us.trustedauth.com";

// Create a new instance of the API.
const sdk = new API({
  basePath,
});

// Authenticate to the Admin API application.
const authResponse = await sdk.authenticateAdminApiUsingPOST({
  applicationId: process.env.ADMIN_API_APPLICATION_ID,
  sharedSecret: process.env.ADMIN_API_SHARED_SECRET,
});

// Get the authToken from the response
const { authToken } = authResponse.data;

// Set the authToken so it can be used in all API calls
sdk.setApiKey(authToken);

// Exampe: List all Authentication API applications
const listResponse = await sdk.listAuthApiApplicationsUsingGET();

// Print the response
console.log(listResponse.data);
```

## Help

For more information on how to use the APIs please refer to the Identity as a Service [API documentation](https://entrust.us.trustedauth.com/help/developer).
