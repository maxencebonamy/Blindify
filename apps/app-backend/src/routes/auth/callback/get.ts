import { env } from "#/config/env"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
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
		400: z.object({
			error: z.string()
		}),
		403: z.object({
			error: z.string()
		}),
		500: z.object({
			error: z.string()
		}),
		502: z.object({
			error: z.string()
		})
	}
} satisfies AutoLoaderSchema

const idTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	scope: z.string(),
	expires_in: z.number(),
	refresh_token: z.string().optional()
})

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	if (request.query.error !== undefined) {
		return reply.code(403).send({ error: `Authotization not granted: ${request.query.error}` })
	}

	const { code } = request.query
	// TODO: handle state validation

	const idTokenResponse = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Authorization": "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: `${env.APP_URL}/auth/callback`
		})
	})
	if (!idTokenResponse.ok) {
		return reply.code(502).send({ error: "Token exchange failed" })
	}

	const idToken = await idTokenResponse.json()
	const parsedIdToken = idTokenSchema.safeParse(idToken)
	if (!parsedIdToken.success) {
		return reply.code(500).send({ error: `Invalid ID token: ${parsedIdToken.error}` })
	}

	const { access_token } = parsedIdToken.data
	return reply
		.setCookie("access_token", access_token, {
			httpOnly: true,
			secure: env.APP_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: parsedIdToken.data.expires_in
		})
		.redirect(env.FRONTEND_URL)
}
