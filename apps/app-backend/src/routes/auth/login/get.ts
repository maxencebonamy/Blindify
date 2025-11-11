import { env } from "#/config/env"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { cache } from "lib-cache"
import { connector } from "lib-platform-connector"
import { random } from "lib-utils"
import z from "zod"

export const schema = {
	operationId: "authLogin",
	description: "Login with Spotify",
	tags: [ "auth" ],
	querystring: z.object({
		redirectUri: z.string()
	}),
	response: {
		302: z.any()
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const state = random.uuid()
	await cache.set(`auth:${state}`, request.query.redirectUri)

	const authorizeUrl = connector("spotify").oAuthAuthorizeUrl(`${env.APP_URL}/auth/callback`, state)
	return reply.redirect(authorizeUrl)
}
