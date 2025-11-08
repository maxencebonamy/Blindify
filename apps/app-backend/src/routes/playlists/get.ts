import { getAllUserPlaylists } from "#/services/playlist"
import { paginateFromAllItems, zPage } from "#/types/page.type"
import { zPlaylist } from "#/types/playlist.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "indexUserPlaylists",
	description: "Get current user's playlists",
	auth: true,
	tags: [ "playlists" ],
	querystring: z.object({
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20),
		search: z.string().optional(),
		sort: z.enum([ "name", "trackCount" ]).optional(),
		order: z.enum([ "asc", "desc" ]).optional()
	}),
	response: {
		200: zPage(zPlaylist).extend({
			lastFetchedAt: z.date()
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const playlistArray = await getAllUserPlaylists(request.accessToken)

	const filteredPlaylists = playlistArray.playlists.filter(
		playlist => !request.query.search || playlist.name.toLocaleLowerCase().includes(request.query.search.toLocaleLowerCase())
	)

	const paginatedPlaylists = paginateFromAllItems(filteredPlaylists, request.query.page, request.query.limit)

	return reply.send({
		...paginatedPlaylists,
		lastFetchedAt: playlistArray.lastFetchedAt
	})
}
