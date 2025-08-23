import { getAllUserPlaylists } from "#/services/playlist"
import { zApiError } from "#/types/error.type"
import { paginateFromAllItems, zPage } from "#/types/page.type"
import { zPlaylist } from "#/types/playlist.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "indexUserPlaylists",
	description: "Get current user's playlists",
	tags: [ "playlists" ],
	querystring: z.object({
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20),
		search: z.string().optional(),
		sort: z.enum([ "name", "trackCount" ]).optional(),
		order: z.enum([ "asc", "desc" ]).optional()
	}),
	response: {
		200: zPage(zPlaylist),
		401: zApiError,
		500: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	const allPlaylists = await getAllUserPlaylists(accessToken)

	const filteredPlaylists = allPlaylists.filter(
		playlist => !request.query.search || playlist.name.toLocaleLowerCase().includes(request.query.search.toLocaleLowerCase())
	)

	const paginatedPlaylists = paginateFromAllItems(filteredPlaylists, request.query.page, request.query.limit)

	return reply.send(paginatedPlaylists)
}
