# lib-env

Parse and validate environment variables.

## Get started

Install the lib and zod:

```bash
pnpm i lib-env --workspace
pnpm i zod
```

Create a file `env.ts` and paste the following code:

```ts
import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv(process.env, z.object({
	EXAMPLE: z.string(),
}))
```

## Usage

Import the `env` object from the `env.ts` file and use it to access your environment variables:

```ts
import { env } from "#/env"
import { logger } from "lib-logger"

logger.info(env.EXAMPLE) // autocomplete and type safety
```

When you run your application, the environment variables will be validated and parsed according to the schema you defined in `env.ts`.
If any of the variables are missing or invalid, an error will be thrown.
