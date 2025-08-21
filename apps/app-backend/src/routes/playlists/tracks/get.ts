import { getAllTracksFromPlaylist } from "#/services/track"
import { paginateFromAllItems, zPage } from "#/types/page.type"
import { zTrack } from "#/types/track.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { logger } from "lib-logger"
import z from "zod"

export const schema = {
	operationId: "indexPlaylistTracks",
	description: "Get playlist tracks",
	tags: [ "playlists" ],
	querystring: z.object({
		spotifyPlaylistId: z.string(),
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20),
		titleFilter: z.string().optional()
	}),
	response: {
		200: zPage(zTrack),
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

	const allTracks = await getAllTracksFromPlaylist(accessToken, request.query.spotifyPlaylistId)
	logger.debug(`allTracks: ${allTracks.length}`)

	const filteredTracks = allTracks.filter(
		track => !request.query.titleFilter || track.title.toLocaleLowerCase().includes(request.query.titleFilter.toLocaleLowerCase())
	)

	const paginatedTracks = paginateFromAllItems(filteredTracks, request.query.page, request.query.limit)

	return reply.send(paginatedTracks)
}
