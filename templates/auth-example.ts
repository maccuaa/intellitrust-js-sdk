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
