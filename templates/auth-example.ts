const basePath = "https://entrust.us.trustedauth.com";

const queryParms: AuthSDK.UserAuthenticateQueryParameters = {
  userId: "john.doe",
  applicationId: "d2f37667-253b-4260-aab1-6131f1d83fe4",
};

// Create a new instance of the API.
const sdk = new AuthSDK.API({
  basePath,
});

// Get the user's authenticators that are available to authenticate with
const response = await sdk.userAuthenticatorQueryUsingPOST(queryParms);

// Print the response.
console.log(response.data);
