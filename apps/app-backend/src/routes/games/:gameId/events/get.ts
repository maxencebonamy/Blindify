import { env } from "#/config/env"
import { zErrorObject } from "#/generated/zod.gen"
import { addSubscriber, removeSubscriber } from "#/services/sse"
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
		401: zErrorObject,
		403: zErrorObject
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ message: "Access token missing" })
	}

	const origin = request.headers.origin ?? ""
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
