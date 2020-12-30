# NoCap

NodeJS implementation of multiple captcha solving services in one wrapper.

## Advantages

- Made in Typescript
- Uses [got](https://github.com/sindresorhus/got) as `http` client, making all functions asynchronous
- Currently supports [2Captcha](http://2captcha.com/?from=7875027) and [Cap Monster](https://capmonster.cloud/)
- Supports all ReCaptcha V2

# Quickstart

Examples of how to use the captcha wrapper

## Installation

Wrapper is not available on `npm`, but is currently available via [yarn](https://yarnpkg.com/)

## Creating a new client

`2Captcha` can be replaced

```js
import NoCap from "NoCap";

const apiKey = "";
const client = new NoCap("2Captcha", key);
```

## Solving a ReCaptcha challenge

Using the previous client,

```js
(async () => {
  const googlekey = "6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd";
  const pageURL =
    "https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high";

  const token = await client.reCaptchaV2(googleKey, pageURL);
  console.log(token);
})();
```

# TODO

- Create a Firefox extension that spoofs page URL so manual solving is possible. Work has been started [here](https://github.com/zMrKrabz/NoCapExtension).
- Add support for hcaptcha and manual image recognition.
