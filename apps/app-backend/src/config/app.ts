import type { HTTPMethods } from "fastify"
import Fastify from "fastify"
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import swagger from "@fastify/swagger"
import scalar from "@scalar/fastify-api-reference"
import { logger } from "lib-logger"
import { env } from "#/config/env"
import { validatorCompiler, serializerCompiler, jsonSchemaTransformObject, jsonSchemaTransform } from "fastify-type-provider-zod"
import { autoLoader } from "lib-auto-loader"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = Fastify()

app.register(cors, {
	origin: env.ALLOWED_ORIGINS,
	credentials: true,
	methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ] satisfies HTTPMethods[]
})

app.register(cookie)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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
	},
	transform: jsonSchemaTransform,
	transformObject: jsonSchemaTransformObject
})

void app.register(scalar, {
	routePrefix: "/docs"
})

void app.register(autoLoader, {
	routesDir: path.join(__dirname, "..", "routes"),
	jobsDir: path.join(__dirname, "..", "jobs")
})

export const start = async (): Promise<void> => {
	try {
		await app.listen({ port: env.APP_PORT, host: "0.0.0.0" })
		app.swagger()
		app.cron.startAllJobs()
		logger.info(`Server listening on ${env.APP_URL}`)
	} catch (err) {
		logger.fatal("Error when starting server:", err instanceof Error && err.message)
	}
}
