# IntelliTrust JavaScript SDK

[![Build Status](https://travis-ci.org/maccuaa/intellitrust-js-sdk.svg?branch=master)](https://travis-ci.org/maccuaa/intellitrust-js-sdk)

This repository generates the IntelliTrust JavaScript SDKs for the Entrust Datacard IntelliTrust Administration and Authentication APIs.

These are not official SDKs, this is a community project.

- SDKS generated using [Open API Generator](https://openapi-generator.tech/)
- Includes TypeScript definitions

### Docs

The instructions for installing and using the SDKs are published with the NPM package. See the SDK doc links below.

Latest supported version: **5.5**

|                | Documentation                                                                       | SDK                                                                  | Badges                                                                                                                                                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Administration | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/administration.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk) | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk) |
| Authentication | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/authentication.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)  | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)     |

### Updating

Updating the Swagger files:

```shell
npm run download
```

Also update version in README.

### Generating

Generating the SDKs:

```shell
npm run build
```

### Publishing

Publish the SDKs. Make sure to pass in the OTP code.

```shell
npm run publish -- [OTP]
```

TODO:

- Travis Cron job to download latest?
- Swagger UI? (or something similar)
