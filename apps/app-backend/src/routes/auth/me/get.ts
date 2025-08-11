import { getCurrentUsersProfile } from "#/generated"
import { zPrivateUserObject } from "#/generated/zod.gen"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"
import z from "zod"

export const method: HTTPMethods = "GET"

export const url = "/auth/me"

export const schema = {
	operationId: "authMe",
	description: "Get current user profile",
	tags: [ "auth" ],
	response: {
		200: zPrivateUserObject,
		401: z.object({
			error: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies Schema

export const handler: Handler<typeof schema> = async (request, reply) => {
	logger.debug(`${method} ${url}`)

	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ error: "Access token missing" })
	}

	const user = await getCurrentUsersProfile({ headers: { authorization: `Bearer ${accessToken}` } })
	if (user.error) {
		return reply.code(401).send({ error: user.error.error.message })
	}

	return reply.send(user.data)
}
