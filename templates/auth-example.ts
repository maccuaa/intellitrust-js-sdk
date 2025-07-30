const basePath = "https://entrust.us.trustedauth.com";

const queryParms: AuthSDK.UserAuthenticateQueryParameters = {
  userId: "john.doe",
  applicationId: process.env.AUTH_API_APPLICATION_ID,
};

// Create a new instance of the API.
const sdk = new AuthSDK.API({
  basePath,
});

// Get the user's authenticators that are available to authenticate with
const response = await sdk.userAuthenticatorQueryUsingPOST(queryParms);

// Print the response.
console.log(response.data);
