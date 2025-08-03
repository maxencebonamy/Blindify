import { env } from "#/config/env"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"
import { z } from "zod"

export const method: HTTPMethods = "GET"

export const url = "/auth/callback"

export const handler: Handler = async (request, reply) => {
	logger.debug(`${method} ${url}`)

	const querySchema = z.union([
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
	])

	const query = querySchema.safeParse(request.query)
	if (!query.success) {
		return reply.code(400).send({ error: `Bad request: ${query.error}` })
	}

	const queryData = query.data
	if (queryData.error !== undefined) {
		return reply.code(500).send({ error: `Authotization not granted: ${queryData.error}` })
	}

	const { code } = queryData
	// TODO: handle state validation

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

	const responseSchema = z.object({
		access_token: z.string(),
		token_type: z.string(),
		scope: z.string(),
		expires_in: z.number(),
		refresh_token: z.string().optional()
	})

	const parsedTokenData = responseSchema.safeParse(tokenData)
	if (!parsedTokenData.success) {
		return reply.code(500).send({ error: `Invalid token response: ${parsedTokenData.error}` })
	}

	const { access_token } = parsedTokenData.data

	return reply
		.setCookie("access_token", access_token, {
			httpOnly: true,
			secure: false,
			path: "/",
			maxAge: tokenData.expires_in
		})
		.redirect(env.FRONTEND_URL)
}

export const schema: Schema = {
	operationId: "authCallback",
	description: "Spotify auth callback",
	tags: [ "auth" ],
	querystring: {
		type: "object",
		required: [ "state" ],
		properties: {
			code: { type: "string" },
			error: { type: "string" },
			state: { type: "string" }
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
