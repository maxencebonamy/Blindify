import { env } from "#/config/env"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/auth/callback"

export const handler: Handler = async (request, reply) => {
	logger.debug(`${method} ${url}`)

	const { code, redirect_uri } = request.query as { code: string, redirect_uri: string }

	const res = await fetch("https://accounts.spotify.com/api/token", {
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

	if (!res.ok) {
		return reply.code(500).send({ error: "Token exchange failed" })
	}

	const tokenData = await res.json()

	reply
		.setCookie("access_token", tokenData.access_token, {
			httpOnly: true,
			secure: false,
			path: "/",
			maxAge: tokenData.expires_in
		})
		.redirect(redirect_uri)
	return tokenData
}

export const schema: Schema = {
	operationId: "authCallback",
	description: "Spotify auth callback",
	tags: [ "auth" ],
	querystring: {
		type: "object",
		required: [ "code", "redirect_uri" ],
		properties: {
			code: { type: "string" },
			state: { type: "string" },
			redirect_uri: { type: "string", format: "uri" }
		}
	},
	response: {
		200: {
			description: "Tokens",
			type: "object",
			properties: {
				access_token: { type: "string" },
				token_type: { type: "string" },
				scope: { type: "string" },
				expires_in: { type: "number" },
				refresh_token: { type: "string" }
			}
		}
	}
}
