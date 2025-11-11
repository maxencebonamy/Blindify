import { env } from "#/config/env"
import { addSubscriber, removeSubscriber } from "#/services/sse"
import { zApiError } from "#/types/error.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { logger } from "lib-logger"
import z from "zod"

export const schema = {
	operationId: "subscribeGameEvents",
	description: "Subscribe to game events",
	auth: true,
	tags: [ "games" ],
	params: z.object({
		gameId: z.string()
	}),
	response: {
		403: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	logger.info(request.headers)
	const origin = request.headers?.origin ?? ""
	if (!env.ALLOWED_ORIGINS.includes(origin)) {
		return reply.code(403).send({ message: "Origin not allowed" })
	}

	reply.raw.setHeader("Content-Type", "text/event-stream")
	reply.raw.setHeader("Cache-Control", "no-cache")
	reply.raw.setHeader("Connection", "keep-alive")
	reply.raw.setHeader("Access-Control-Allow-Origin", origin)
	reply.raw.setHeader("Access-Control-Allow-Credentials", "true")
	reply.raw.flushHeaders?.()

	addSubscriber(request.params.gameId, reply.raw)
	request.raw.on("close", () => removeSubscriber(request.params.gameId, reply.raw))
}
