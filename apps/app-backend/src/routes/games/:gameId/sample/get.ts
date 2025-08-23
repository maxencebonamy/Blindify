import { getCurrentSampleGame } from "#/services/game"
import { zApiError } from "#/types/error.type"
import { zSample } from "#/types/sample.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showSampleGame",
	description: "Get current sample of a game",
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	}),
	response: {
		200: zSample,
		500: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	const sample = await getCurrentSampleGame(request.params.gameId)

	return reply.send(sample)
}
