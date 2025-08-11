import { env } from "#/config/env"
import type { Handler, Schema } from "#/types/fastify"
import { generateRandomState } from "#/utils/random"
import { buildUrl } from "#/utils/url"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"
import z from "zod"

export const method: HTTPMethods = "GET"

export const url = "/auth/login"

export const schema = {
	operationId: "authLogin",
	description: "Login with Spotify",
	tags: [ "auth" ],
	response: {
		302: z.any(),
		500: z.object({
			error: z.string()
		})
	}
} satisfies Schema

export const handler: Handler<typeof schema> = async (_, reply) => {
	logger.debug(`${method} ${url}`)

	const spotifyUrl = buildUrl("https://accounts.spotify.com/authorize", {
		client_id: env.SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: `${env.APP_URL}/auth/callback`,
		state: generateRandomState(),
		scope: "user-read-private user-read-email"
	})

	return reply.redirect(spotifyUrl)
}
