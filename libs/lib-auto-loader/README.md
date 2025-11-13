# lib-auto-loader

Fastify plugin that loads routes and jobs using folder architecture.

## Get started

Install the lib:

```bash
pnpm add --workspace lib-auto-loader
```

Register the plugin to your Fastify app:

```ts
import { autoLoader } from "lib-auto-loader"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = Fastify()

void app.register(autoLoader, {
	routesDir: path.join(__dirname, "routes"),
	jobsDir: path.join(__dirname, "jobs")
})
```

## Routes

A route is defined using a `.ts` file that must be placed either in one or many subfolders of the `routesDir` folder, or directly at the root of the latter.
If the name of the file starts with `_`, then it will be ignored.

The path of the file from the `routesDir` indicates the URI of the route that will be exposed by Fastify.
In addition, the name of the file corresponds to the HTTP method.

For example, considering that `routesDir` is the `routes` folder, if you have a file `routes/get.ts`, then an endpoint `GET /` will be exposed.
If you have a file `routes/articles/post.ts`, then an endpoint `POST /articles` will be exposed.

You can add path params by letting a subfolder name start by `:`.
For example, if you have a file `routes/articles/:id/patch.ts`, then an endpoint `PATCH /articles/{id}` will be exposed.

A route file must export these values:
- `schema`: the Fastify schema that describes the endpoint (params, response, ...)
- `handler`: the function executed at each endpoint call

Note that the handler parameters, `request` and `reply`, are automatically type-inferred by the schema.

Example:

```ts
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"
import { zArticle } from "#/types/articles"
import { getArticleById } from "#/services/articles"

export const schema = {
	operationId: "showArticle",
	description: "Get an article",
	auth: true,
	tags: [ "articles" ],
	params: z.object({
		id: z.string()
	}),
	response: {
		200: zArticle
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const article = await getArticleById(request.session.id, request.params.id)
	return reply.send(article)
}
```

If `auth` is set to `true` in the schema, the handler will automatically check for a `sessionId` cookie and verify the session using `lib-session`.
Then the `session` object will be present in the `request variable`.
If the session is invalid or cannot be checked, a `401` error is returned.

## Jobs

A job is defined using a `.ts` file that must be placed directly at the root of the `jobDir` folder.
The name of the file does not matter, except if it starts with `_`, then it will be ignored.

A job file must export these values:
- `cron`: the CRON time string that indicates the frequency of the task
- `task`: the function executed at each job invocation

Example:

```ts
import type { AutoLoaderTask } from "lib-auto-loader"
import { logger } from "lib-logger"

export const cron = "0 * * * * *"

export const task: AutoLoaderTask = async () => {
	logger.info("I am invoked every minute")
}
```
