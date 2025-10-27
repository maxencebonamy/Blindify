import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "checkHealth",
	description: "Health check endpoint",
	tags: [ "health" ],
	response: {
		200: z.object({
			status: z.literal("ok")
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (_, reply) => {
	return reply.send({ status: "ok" })
}
