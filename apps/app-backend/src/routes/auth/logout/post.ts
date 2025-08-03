import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "POST"

export const url = "/auth/logout"

export const handler: Handler = async (_, reply) => {
	logger.debug(`${method} ${url}`)

	return reply.clearCookie("access_token", {
		path: "/",
		httpOnly: true,
		secure: false
	}).send({ message: "Logout successful" })
}

export const schema: Schema = {
	operationId: "authLogout",
	description: "Logout user",
	tags: [ "auth" ],
	response: {
		200: {
			description: "Logout successful",
			type: "null"
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
