import { invalidateUserPlaylistsCache } from "#/services/playlist"
import { zApiError } from "#/types/error.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "invalidateUserPlaylistsCache",
	description: "Invalidate cache of current user's playlists",
	tags: [ "playlists" ],
	response: {
		200: z.string(),
		401: zApiError,
		500: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	await invalidateUserPlaylistsCache(accessToken)

	return reply.send("Cache invalidated")
}
