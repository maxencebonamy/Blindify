import { createGame, loadGame } from "#/services/game"
import { getPlaylistById } from "#/services/playlist"
import { zApiError } from "#/types/error.type"
import { zGame, zGameSettings } from "#/types/game.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "storeGame",
	description: "Create a new game",
	tags: [ "games" ],
	body: z.object({
		playlistId: z.string(),
		settings: zGameSettings
	}),
	response: {
		200: zGame,
		500: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	const playlist = await getPlaylistById(accessToken, request.body.playlistId)

	const game = await createGame(playlist, request.body.settings)
	void loadGame(accessToken, game)

	return reply.send(game)
}
