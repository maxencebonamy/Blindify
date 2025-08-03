import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/health"

export const handler: Handler = async () => {
	logger.debug(`${method} ${url}`)

	return { status: "ok" }
}

export const schema: Schema = {
	operationId: "checkHealth",
	description: "Health check endpoint",
	response: {
		200: {
			description: "Success",
			type: "object",
			properties: {
				status: { type: "string" }
			}
		}
	}
}
