import { getGameById } from "#/services/game"
import { zGame } from "#/types/game.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showGame",
	description: "Get a game",
	auth: true,
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	}),
	response: {
		200: zGame
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const game = await getGameById(request.params.gameId)

	return reply.send(game)
}
