# @maccuaa/intellitrust-auth-sdk

This is a JavaScript client for the Entrust Identity as a Service  API. This module can be used in the following environments:

- Node.js
- Browser

It can be used in both TypeScript and JavaScript projects.

## Installation

```bash
npm install @maccuaa/intellitrust-auth-sdk --save
```

## Usage

**NOTE:** Make sure to replace the configuration values in the examples with the values from your Identity as a Service account!

```javascript
import { API } from "@maccuaa/intellitrust-auth-sdk";

const basePath = "https://entrust.us.trustedauth.com";

// Create a new instance of the API.
const sdk = new API({
  basePath,
});

// Get the user's authenticators that are available to authenticate with
const response = await sdk.userAuthenticatorQueryUsingPOST({
  userId: "john.doe",
  applicationId: process.env.AUTH_API_APPLICATION_ID,
});

// Print the response.
console.log(response.data);
```

## Help

For more information on how to use the APIs please refer to the Identity as a Service [API documentation](https://entrust.us.trustedauth.com/help/developer).
