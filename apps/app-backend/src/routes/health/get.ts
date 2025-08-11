import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"
import z from "zod"

export const method: HTTPMethods = "GET"

export const url = "/health"

export const schema = {
	operationId: "checkHealth",
	description: "Health check endpoint",
	response: {
		200: z.object({
			status: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies Schema

export const handler: Handler<typeof schema> = async () => {
	logger.debug(`${method} ${url}`)

	return { status: "ok" }
}
