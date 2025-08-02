import { env } from "#/config/env"
import type { Handler, Schema } from "#/types/fastify"
import { generateRandomState } from "#/utils/random"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/auth/login"

export const handler: Handler = async (_, reply) => {
	logger.debug(`${method} ${url}`)

	const spotifyUrl = new URL("https://accounts.spotify.com/authorize")
	spotifyUrl.searchParams.set("client_id", env.SPOTIFY_CLIENT_ID)
	spotifyUrl.searchParams.set("response_type", "code")
	spotifyUrl.searchParams.set("redirect_uri", `${env.APP_URL}/auth/callback`)
	spotifyUrl.searchParams.set("state", generateRandomState())
	spotifyUrl.searchParams.set("scope", "user-read-private user-read-email")

	reply.redirect(spotifyUrl.toString())
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
