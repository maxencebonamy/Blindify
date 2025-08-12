import type { Handler, Schema } from "#/types/fastify"
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
} satisfies Schema

export const handler: Handler<typeof schema> = async () => {
	return { status: "ok" }
}
