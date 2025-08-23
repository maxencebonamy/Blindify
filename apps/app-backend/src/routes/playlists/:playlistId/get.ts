import { getPlaylistById } from "#/services/playlist"
import { zApiError } from "#/types/error.type"
import { zPlaylist } from "#/types/playlist.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showUserPlaylist",
	description: "Get current user's playlist",
	tags: [ "playlists" ],
	params: z.object({
		playlistId: z.string()
	}),
	response: {
		200: zPlaylist,
		500: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	const playlist = await getPlaylistById(accessToken, request.params.playlistId)

	return reply.send(playlist)
}
