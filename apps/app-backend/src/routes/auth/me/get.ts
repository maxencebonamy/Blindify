import { getCurrentUsersProfile } from "#/generated"
import { zPrivateUserObject } from "#/generated/zod.gen"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

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
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
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
