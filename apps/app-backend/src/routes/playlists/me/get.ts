import { paginate, zPage } from "lib-pagination"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { zPlaylist } from "lib-platform-connector"
import z from "zod"
import { getAllUserPlaylists } from "#/services/playlist"

export const schema = {
	operationId: "indexUserPlaylists",
	description: "Get current user's playlists",
	auth: true,
	tags: [ "playlists" ],
	querystring: z.object({
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20),
		search: z.string().optional()
	}),
	response: {
		200: zPage(zPlaylist.nullable()).extend({
			lastFetchedAt: z.date()
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const playlistArray = await getAllUserPlaylists(request.session.accessToken)

	const filteredPlaylists = playlistArray.playlists.filter(
		playlist => !request.query.search || playlist.name.toLocaleLowerCase().includes(request.query.search.toLocaleLowerCase())
	)

	const paginatedPlaylists = paginate.fromSource(filteredPlaylists, { currentPage: request.query.page, pageSize: request.query.limit })

	return reply.send({
		...paginatedPlaylists,
		lastFetchedAt: playlistArray.lastFetchedAt
	})
}
