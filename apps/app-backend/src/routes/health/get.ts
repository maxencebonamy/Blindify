import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

export const schema = {
	operationId: "checkHealth",
	description: "Health check endpoint",
	tags: [ "health" ],
	response: {
		200: z.object({
			status: z.literal("ok")
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async () => {
	return { status: "ok" }
}
