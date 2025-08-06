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
