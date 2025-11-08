import { getPlaylistById } from "#/services/playlist"
import { zPlaylist } from "#/types/playlist.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showUserPlaylist",
	description: "Get current user's playlist",
	auth: true,
	tags: [ "playlists" ],
	params: z.object({
		playlistId: z.string()
	}),
	response: {
		200: zPlaylist
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const playlist = await getPlaylistById(request.accessToken, request.params.playlistId)

	return reply.send(playlist)
}
