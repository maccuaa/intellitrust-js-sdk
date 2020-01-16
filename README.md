# IntelliTrust JavaScript SDK

This repository generates the IntelliTrust JavaScript SDKs for the Entrust Datacard IntelliTrust Administration and Authentication APIs.

These are not official SDKs, this is a community project.

- SDKS generated using [Open API Generator](https://openapi-generator.tech/)
- Includes TypeScript definitions

### Docs

The instructions for installing and using the SDKs are published with the NPM package. See the SDK doc links below.

Latest supported version: **5.5**

|                | API                                                                                 | SDK                                                                  |
| -------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Administration | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/administration.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk) |
| Authentication | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/authentication.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)  |

### Updating

1. Update the Open API JSON files.
1. Update the NPM Version in the config JSON files.
1. Update lates version in README.

### Updating

Updating the Swagger files.

```shell
npm run download
```

### Generating

Generating the SDKs.

```shell
npm run build
```

### Update & Generated

To update the Swagger files and generate the SDKs:

```shell
npm run ci:build
```

### Publishing

Publish the SDKs. Make sure to pass in the OTP code.

```shell
npm run publish -- [OTP]
```

TODO:

- Swagger UI? (or something similar)
