# IntelliTrust JavaScript SDK

This repository generates the IntelliTrust JavaScript SDKs for the Entrust Datacard IntelliTrust Administration and Authentication APIs.

These are not official SDKs, this is a community project.

- SDKS generated using [Open API Generator](https://openapi-generator.tech/)
- Includes TypeScript definitions

### Docs

Latest supported version: **5.5**

|                | API                                                                                 | SDK                                                                  |
| -------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Administration | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/administration.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk) |
| Authentication | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/authentication.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)  |

### Updating

1. Update the Open API JSON files.
1. Update the NPM Version in the config JSON files.
1. Update lates version in README.

### Generating

Generating the SDKs

```shell
npm run build
```

### Publishing

Publish the SDKs. Make sure to pass in the OTP code.

```shell
npm run publish -- [OTP]
```

TODO:

- Add download script
- Add CI build
- Automate PR creation with Zapier
