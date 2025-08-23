import { addSubscriber, removeSubscriber } from "#/services/sse"
import { zApiError } from "#/types/error.type"
import { zGame } from "#/types/game.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "subscribeGameEvents",
	description: "Subscribe to game events",
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

	reply.raw.setHeader("Content-Type", "text/event-stream")
	reply.raw.setHeader("Cache-Control", "no-cache")
	reply.raw.setHeader("Connection", "keep-alive")

	addSubscriber(request.params.gameId, reply.raw)
	request.raw.on("close", () => removeSubscriber(request.params.gameId, reply.raw))
}
