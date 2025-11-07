import { invalidateUserPlaylistsCache } from "#/services/playlist"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "invalidateUserPlaylistsCache",
	description: "Invalidate cache of current user's playlists",
	auth: true,
	tags: [ "playlists" ],
	response: {
		200: z.string()
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	await invalidateUserPlaylistsCache(request.accessToken)

	return reply.send("Cache invalidated")
}
