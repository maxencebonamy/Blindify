import { env } from "#/config/env"
import { addSubscriber, removeSubscriber } from "#/services/sse"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "subscribeGameEvents",
	description: "Subscribe to game events",
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	})
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	reply.raw.setHeader("Content-Type", "text/event-stream")
	reply.raw.setHeader("Cache-Control", "no-cache")
	reply.raw.setHeader("Connection", "keep-alive")
	reply.raw.setHeader("Access-Control-Allow-Origin", env.ALLOWED_ORIGINS)
	reply.raw.setHeader("Access-Control-Allow-Credentials", "true")
	reply.raw.flushHeaders?.()

	addSubscriber(request.params.gameId, reply.raw)
	request.raw.on("close", () => removeSubscriber(request.params.gameId, reply.raw))
}
