import { getArtistById } from "#/services/artist"
import { createGame, loadGame } from "#/services/game"
import { zGame, zGameSettings } from "#/types/game.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "storeGame",
	description: "Create a new game",
	auth: true,
	tags: [ "games" ],
	body: z.object({
		artistId: z.coerce.number(),
		settings: zGameSettings
	}),
	response: {
		200: zGame
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const artist = await getArtistById(request.body.artistId)

	const game = await createGame(artist, request.body.settings)
	void loadGame(game)

	return reply.send(game)
}
