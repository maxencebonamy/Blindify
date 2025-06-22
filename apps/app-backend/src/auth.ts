import { env } from "#/env"
import type { FastifyInstance } from "fastify"

const SCOPE = "user-read-private user-read-email"

const generateRandomState = (): string => {
	return Math.random().toString(36).substring(2, 15)
}

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.get("/login", {
		schema: {
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
	}, async (_, reply) => {
		const url = new URL("https://accounts.spotify.com/authorize")
		url.searchParams.set("client_id", env.SPOTIFY_CLIENT_ID)
		url.searchParams.set("response_type", "code")
		url.searchParams.set("redirect_uri", env.SPOTIFY_REDIRECT_URI)
		url.searchParams.set("scope", SCOPE)
		url.searchParams.set("state", generateRandomState())

		reply.redirect(url.toString())
	})

	fastify.get("/callback", {
		schema: {
			operationId: "authCallback",
			description: "Spotify auth callback",
			tags: [ "auth" ],
			querystring: {
				type: "object",
				required: [ "code" ],
				properties: {
					code: { type: "string" },
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
	}, async (request, reply) => {
		const { code } = request.query as { code: string }

		const res = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Authorization": "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: env.SPOTIFY_REDIRECT_URI
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
			.redirect("http://localhost:5173/dashboard")
		return tokenData
	})
}
