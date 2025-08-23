import { env } from "#/config/env"
import { generateRandomState } from "#/utils/random"
import { buildUrl } from "#/utils/url"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

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
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (_, reply) => {
	const spotifyUrl = buildUrl("https://accounts.spotify.com/authorize", {
		client_id: env.SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: `${env.APP_URL}/auth/callback`,
		state: generateRandomState(),
		scope: "user-read-private user-read-email playlist-read-private"
	})

	return reply.redirect(spotifyUrl)
}
