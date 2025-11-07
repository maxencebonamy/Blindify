import { getCurrentUsersProfile } from "#/generated"
import { zPrivateUserObject } from "#/generated/zod.gen"
import { zApiError } from "#/types/error.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"

export const schema = {
	operationId: "authMe",
	description: "Get current user profile",
	auth: true,
	tags: [ "auth" ],
	response: {
		200: zPrivateUserObject,
		401: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const user = await getCurrentUsersProfile({ headers: { authorization: `Bearer ${request.accessToken}` } })
	if (user.error) {
		return reply.code(401).send({ error: user.error.error.message })
	}

	return reply.send(user.data)
}
