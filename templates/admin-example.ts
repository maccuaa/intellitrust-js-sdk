const basePath = "https://entrust.us.trustedauth.com";

// Admin API application credentials
const credentials: AdminSDK.AdminApiAuthentication = {
  applicationId: process.env.ADMIN_API_APPLICATION_ID,
  sharedSecret: process.env.ADMIN_API_SHARED_SECRET,
};

// Create a new instance of the API.
const sdk = new AdminSDK.API({
  basePath,
});

// Authenticate to the Admin API application.
const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

// Get the authToken from the response
const { authToken } = authResponse.data;

// Set the authToken so it can be used in all API calls
sdk.setApiKey(authToken);

// Exampe: List all Authentication API applications
const listResponse = await sdk.listAuthApiApplicationsUsingGET();

// Print the response
console.log(listResponse.data);
