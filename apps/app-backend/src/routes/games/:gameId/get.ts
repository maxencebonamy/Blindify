import { getGameById } from "#/services/game"
import { zApiError } from "#/types/error.type"
import { zGame } from "#/types/game.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showGame",
	description: "Get a game",
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
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

	const game = await getGameById(request.params.gameId)

	return reply.send(game)
}
