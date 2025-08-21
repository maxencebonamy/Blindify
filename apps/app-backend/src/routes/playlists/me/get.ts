import { getAllUserPlaylists } from "#/services/playlist"
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
		nameFilter: z.string().optional()
	}),
	response: {
		200: zPage(zPlaylist),
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

	const allPlaylists = await getAllUserPlaylists(accessToken)

	const filteredPlaylists = allPlaylists.filter(
		playlist => !request.query.nameFilter || playlist.name.toLocaleLowerCase().includes(request.query.nameFilter.toLocaleLowerCase())
	)

	const paginatedPlaylists = paginateFromAllItems(filteredPlaylists, request.query.page, request.query.limit)

	return reply.send(paginatedPlaylists)
}
