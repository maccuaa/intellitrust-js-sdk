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
