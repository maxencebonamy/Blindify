# lib-utils

Some util functions shared across apps and libs.

## Get started

Install the lib:

```bash
pnpm add --workspace lib-utils
```

## Arrays

```ts
import { arrays } from "lib-utils"

// scramble() shuffles all the elements of an array randomly, without copy it
arrays.scramble(things)
```

## Errors

```ts
import { errors } from "lib-utils"

// from() takes an unknown parameter and transforms it to an error (useful in try/catch blocks)
errors.from(error)
```

## HTTP

```ts
import { http } from "lib-utils"

// buildUrl() builds an URL with query params from an object, and url-encodes them
const url = http.buildUrl("https://example.com/oauth/authorize", {
	client_id: env.CLIENT_ID,
	response_type: "code",
	redirect_uri: redirectUri
})
```

## Random

```ts
import { random } from "lib-utils"

// uuid() generates a UUID v4 (uses the "uuid" library)
const id = random.uuid()
```
