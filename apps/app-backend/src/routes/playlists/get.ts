import type { Page } from "lib-pagination"
import { zPage } from "lib-pagination"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import type { Playlist } from "lib-platform-connector"
import { connector, zPlaylist } from "lib-platform-connector"
import z from "zod"

export const schema = {
	operationId: "indexPlaylists",
	description: "Get all playlists",
	auth: true,
	tags: [ "playlists" ],
	querystring: z.object({
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20),
		search: z.string().optional()
	}),
	response: {
		200: zPage(zPlaylist.nullable())
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const { page, limit, search } = request.query

	let playlists: Page<Playlist | null>
	if (!search) {
		playlists = await connector("spotify").getUserPlaylists(request.session.accessToken, page, limit)
	} else {
		playlists = await connector("spotify").searchPublicPlaylists(request.session.accessToken, search, page, limit)
	}

	return reply.send(playlists)
}
