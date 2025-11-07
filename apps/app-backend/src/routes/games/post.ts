import { createGame, loadGame } from "#/services/game"
import { getPlaylistById } from "#/services/playlist"
import { zGame, zGameSettings } from "#/types/game.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "storeGame",
	description: "Create a new game",
	auth: true,
	tags: [ "games" ],
	body: z.object({
		playlistId: z.string(),
		settings: zGameSettings
	}),
	response: {
		200: zGame
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const playlist = await getPlaylistById(request.accessToken, request.body.playlistId)

	const game = await createGame(playlist, request.body.settings)
	void loadGame(request.accessToken, game)

	return reply.send(game)
}
