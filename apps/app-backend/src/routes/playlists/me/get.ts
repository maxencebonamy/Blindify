import { getAllUserPlaylists } from "#/services/playlist"
import type { Handler, Schema } from "#/types/fastify"
import { paginateFromAllItems, zPage } from "#/types/page"
import { zPlaylist } from "#/types/playlist.type"
import { logger } from "lib-logger"
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
} satisfies Schema

export const handler: Handler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ error: "Access token missing" })
	}

	const allPlaylists = await getAllUserPlaylists(accessToken)
	logger.debug(`all playlists: ${allPlaylists.length}`)

	const filteredPlaylists = allPlaylists.filter(
		playlist => !request.query.nameFilter || playlist.name.toLocaleLowerCase().includes(request.query.nameFilter.toLocaleLowerCase())
	)
	logger.debug(`filteredPlaylists: ${filteredPlaylists.length}`)

	const paginatedPlaylists = paginateFromAllItems(filteredPlaylists, request.query.page, request.query.limit)
	logger.debug(`paginatedPlaylists: ${paginatedPlaylists.totalItems}`)

	return reply.send(paginatedPlaylists)
}
