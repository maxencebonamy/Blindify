import { getCurrentSampleGame } from "#/services/game"
import { zSample } from "#/types/sample.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showSampleGame",
	description: "Get current sample of a game",
	auth: true,
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	}),
	response: {
		200: zSample
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const sample = await getCurrentSampleGame(request.params.gameId)

	return reply.send(sample)
}
