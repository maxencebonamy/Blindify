import { paginate, zPage } from "lib-pagination"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"
import { catalog, zCatalogArtist } from "lib-catalog"

export const schema = {
	operationId: "indexArtists",
	description: "Get all artists",
	tags: [ "artists" ],
	querystring: z.object({
		search: z.string().optional(),
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20)
	}),
	response: {
		200: zPage(zCatalogArtist)
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const { page, limit, search } = request.query

	if (!search) {
		return reply.send(paginate.fromSource([], { currentPage: page, pageSize: limit }))
	}

	const artists = await catalog.searchArtists(search, page, limit)

	return reply.send(artists)
}
