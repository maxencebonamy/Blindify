import { getCurrentUsersProfile } from "#/generated"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/auth/me"

export const handler: Handler = async (request, reply) => {
	logger.debug(`${method} ${url}`)

	const accessToken = request.cookies["access_token"]

	if (!accessToken) {
		reply.code(401).send({ error: "Access token missing" })
		return
	}

	const user = await getCurrentUsersProfile({ headers: { authorization: `Bearer ${accessToken}` } })
	if (user.error) {
		reply.code(401).send({ error: user.error.error })
		return
	}

	return reply.send(user.data)
}

export const schema: Schema = {
	operationId: "authMe",
	description: "Get current user profile",
	tags: [ "auth" ],
	response: {
		200: {
			description: "User profile data",
			type: "object",
			properties: {
				id: { type: "string" },
				display_name: { type: "string" },
				email: { type: "string" },
				profile_image_url: { type: "string", format: "uri" }
			}
		},
		401: {
			description: "Unauthorized - Access token missing or invalid",
			type: "object",
			properties: {
				error: { type: "string" }
			}
		},
		500: {
			description: "Internal Server Error",
			type: "object",
			properties: {
				error: { type: "string" }
			}
		}
	}
}
