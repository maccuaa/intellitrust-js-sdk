# @maccuaa/intellitrust-issuance-sdk

This is a JavaScript client for the Entrust Identity as a Service  API. This module can be used in the following environments:

- Node.js
- Browser

It can be used in both TypeScript and JavaScript projects.

## Installation

```bash
npm install @maccuaa/intellitrust-issuance-sdk --save
```

## Usage

**NOTE:** Make sure to replace the configuration values in the examples with the values from your Identity as a Service account!

```javascript
import { API } from "@maccuaa/intellitrust-issuance-sdk";

const basePath = "https://entrust.us.trustedauth.com";

// Issuance API application credentials
const credentials: IssuanceSDK.IssuanceApiAuthentication = {
  applicationId: "792130ae-fe2a-4a83-beb6-afc4306ac9fe",
  sharedSecret: "b_Zv2IRQZe90ENkK59pzFQYrq1aZUJExvv4s7MJM53Q",
};

// Create a new instance of the API.
const sdk = new IssuanceSDK.API({
  basePath,
});

// Authenticate to the Issuance API application.
const authResponse = await sdk.authenticateIssuanceApiUsingPOST(credentials);

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
