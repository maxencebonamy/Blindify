import { getArtistById } from "#/services/artist"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { zCatalogArtist } from "lib-catalog"
import z from "zod"

export const schema = {
	operationId: "showArtist",
	description: "Get artist",
	tags: [ "artists" ],
	params: z.object({
		artistId: z.coerce.number()
	}),
	response: {
		200: zCatalogArtist
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const tracks = await getArtistById(request.params.artistId)

	return reply.send(tracks)
}
