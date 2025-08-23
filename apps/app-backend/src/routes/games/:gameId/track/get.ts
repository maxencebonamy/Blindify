import { getCurrentTrackGame } from "#/services/game"
import { zApiError } from "#/types/error.type"
import { zTrack } from "#/types/track.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "showTrackGame",
	description: "Get current track of a game",
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	}),
	response: {
		200: zTrack,
		500: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	const track = await getCurrentTrackGame(request.params.gameId)

	return reply.send(track)
}
