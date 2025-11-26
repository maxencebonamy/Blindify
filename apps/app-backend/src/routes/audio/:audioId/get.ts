import { zApiError } from "#/types/error.type"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { cache } from "lib-cache"
import z from "zod"

export const schema = {
	operationId: "getAudio",
	description: "Get audio",
	auth: true,
	tags: [ "audio" ],
	params: z.object({
		audioId: z.string()
	}),
	response: {
		200: z.instanceof(Buffer),
		404: zApiError
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	const cacheKey = `audio:${request.params.audioId}`
	const exists = await cache.has(cacheKey)
	if (!exists) {
		return reply.code(404).send({ message: "Audio not found" })
	}

	const encodedBuffer = await cache.get(cacheKey, z.string())
	const buffer = Buffer.from(encodedBuffer, "base64")

	reply.raw.setHeader("Content-Type", "audio/mpeg")
	reply.raw.setHeader("Content-Length", buffer.length)

	return reply.send(buffer)
}
