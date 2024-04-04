# Entrust Identity as a Service JavaScript SDK

[![Build](https://github.com/maccuaa/intellitrust-js-sdk/workflows/Build/badge.svg)](https://github.com/maccuaa/intellitrust-js-sdk/actions?query=workflow%3ABuild)

This repository generates the JavaScript SDKs for the Entrust Identity as a Service Administration and Authentication APIs.

Also included are the Entrust Issuance as a Service APIs.

These are not official SDKs, this is a community project.

- SDKs generated using [Open API Generator](https://openapi-generator.tech/)
- Includes TypeScript definitions

### Docs

The instructions for installing and using the SDKs are published with the NPM package. See the SDK doc links below.

|                | Documentation                                                                       | SDK                                                                     | Badges                                                                                                                                                                                                                                                                                    |
|----------------|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Administration | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/administration.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-admin-sdk)    | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-admin-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-admin-sdk)             |
| Authentication | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/authentication.html) | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-auth-sdk)     | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-auth-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-auth-sdk)                 |
| Issuance       | [API](https://entrust.us.trustedauth.com/documentation/apiDocs/issuance.html)       | [SDK](https://www.npmjs.com/package/@maccuaa/intellitrust-issuance-sdk) | [![NPM Version](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk)](https://badgen.net/npm/v/@maccuaa/intellitrust-issuance-sdk) [![NPM Downloads](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk)](https://badgen.net/npm/dm/@maccuaa/intellitrust-issuance-sdk) |

### Updating

Updating the Swagger files:

```shell
npm run download
```

### Generating

Generating the SDKs:

```shell
npm run build
```

### Publishing

Publish the SDKs.

```shell
npm run publish
```
