import Fastify from "fastify"
import swagger from "@fastify/swagger"
import scalar from "@scalar/fastify-api-reference"
import { logger } from "lib-logger"

const app = Fastify()

app.register(swagger, {
	openapi: {
		openapi: "3.0.0",
		info: {
			title: "Blindify",
			description: "Blindify Backend API",
			version: "1.0.0"
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server"
			}
		]
	}
})

await app.register(scalar, {
	routePrefix: "/docs"
})

app.get("/health", {
	schema: {
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
}, () => {
	return { status: "ok" }
})

const start = async (): Promise<void> => {
	try {
		await app.listen({ port: 3000, host: "0.0.0.0" })
		app.swagger()
		logger.info("Server listening on http://localhost:3000")
	} catch (err) {
		logger.fatal("Error when starting server:", err instanceof Error && err.message)
	}
}

start()
