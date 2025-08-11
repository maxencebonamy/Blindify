import Fastify from "fastify"
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import swagger from "@fastify/swagger"
import scalar from "@scalar/fastify-api-reference"
import { logger } from "lib-logger"
import { env } from "#/config/env"
import { routes } from "#/routes/routes"
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"

const app = Fastify()

app.register(cors, {
	origin: env.ALLOWED_ORIGINS,
	credentials: true
})

app.register(cookie)

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
				url: env.APP_URL,
				description: "Blindify Backend"
			}
		]
	}
})

void app.register(scalar, {
	routePrefix: "/docs"
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

void app.register(routes)

const start = async (): Promise<void> => {
	try {
		await app.listen({ port: env.APP_PORT, host: "0.0.0.0" })
		app.swagger()
		logger.info(`Server listening on ${env.APP_URL}`)
	} catch (err) {
		logger.fatal("Error when starting server:", err instanceof Error && err.message)
	}
}

start()
