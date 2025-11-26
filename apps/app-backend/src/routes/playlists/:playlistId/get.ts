import { getPlaylistById } from "#/services/playlist"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { zPlaylist } from "lib-platform-connector"
import z from "zod"

export const schema = {
	operationId: "showPlaylist",
	description: "Get playlist",
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
	const playlist = await getPlaylistById(request.session.accessToken, request.params.playlistId)

	return reply.send(playlist)
}
