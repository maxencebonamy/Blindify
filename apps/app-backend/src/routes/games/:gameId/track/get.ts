import { getCurrentTrackGame } from "#/services/game"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { zTrack } from "lib-platform-connector"
import z from "zod"

export const schema = {
	operationId: "showTrackGame",
	description: "Get current track of a game",
	auth: true,
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	}),
	response: {
		200: zTrack
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const track = await getCurrentTrackGame(request.params.gameId)

	return reply.send(track)
}
