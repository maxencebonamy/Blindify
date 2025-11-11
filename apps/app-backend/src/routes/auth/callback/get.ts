import { env } from "#/config/env"
import { zApiError } from "#/types/error.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { cache } from "lib-cache"
import { connector } from "lib-platform-connector"
import { z } from "zod"

export const schema = {
	operationId: "authCallback",
	description: "Spotify auth callback",
	tags: [ "auth" ],
	querystring: z.union([
		z.object({
			code: z.string(),
			error: z.undefined(),
			state: z.string()
		}),
		z.object({
			code: z.undefined(),
			error: z.string(),
			state: z.string()
		})
	]),
	response: {
		302: z.any(),
		400: zApiError,
		403: zApiError,
		502: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	if (request.query.error !== undefined) {
		return reply.code(403).send({ message: `Authotization not granted: ${request.query.error}` })
	}

	const { code } = request.query
	const redirectUri = await cache.get<string>(`auth:${request.query.state}`)

	const { accessToken, expiresIn } = await connector("spotify").oAuthTokenExchange(`${env.APP_URL}/auth/callback`, code)

	return reply
		.setCookie("access_token", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			path: "/",
			maxAge: expiresIn
		})
		.redirect(redirectUri)
}
