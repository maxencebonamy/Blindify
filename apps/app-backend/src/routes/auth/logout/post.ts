import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"
import z from "zod"

export const method: HTTPMethods = "POST"

export const url = "/auth/logout"

export const schema = {
	operationId: "authLogout",
	description: "Logout from Spotify",
	tags: [ "auth" ],
	response: {
		200: z.object({
			message: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies Schema

export const handler: Handler<typeof schema> = async (_, reply) => {
	logger.debug(`${method} ${url}`)

	return reply.clearCookie("access_token", {
		path: "/",
		httpOnly: true,
		secure: false
	}).send({ message: "Logout successful" })
}
