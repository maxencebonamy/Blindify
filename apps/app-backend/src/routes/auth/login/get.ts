import { env } from "#/config/env"
import type { Handler, Schema } from "#/types/fastify"
import { generateRandomState } from "#/utils/random"
import { buildUrl } from "#/utils/url"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/auth/login"

export const handler: Handler = async (_, reply) => {
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

export const schema: Schema = {
	operationId: "authLogin",
	description: "Redirect to Spotify authorization",
	tags: [ "auth" ],
	response: {
		302: {
			description: "Redirect to Spotify",
			type: "null"
		}
	}
}
