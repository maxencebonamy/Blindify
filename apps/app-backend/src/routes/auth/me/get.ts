import { zApiError } from "#/types/error.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { spotifyConnector, zUser } from "lib-platform-connector"

export const schema = {
	operationId: "authMe",
	description: "Get current user profile",
	auth: true,
	tags: [ "auth" ],
	response: {
		200: zUser,
		401: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const user = await spotifyConnector.getCurrentUser(request.accessToken)

	return reply.send(user)
}
