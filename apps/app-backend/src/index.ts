import type { HTTPMethods } from "fastify"
import Fastify from "fastify"
import swagger from "@fastify/swagger"
import scalar from "@scalar/fastify-api-reference"
import { logger } from "lib-logger"
import { env } from "#/config/env"
import { validatorCompiler, serializerCompiler, jsonSchemaTransformObject, jsonSchemaTransform } from "fastify-type-provider-zod"
import path from "path"
import { fileURLToPath } from "url"
import { writeFile } from "fs/promises"
import { autoLoader } from "lib-auto-loader"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"

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
	routesDir: path.join(__dirname, "routes"),
	jobsDir: path.join(__dirname, "jobs")
})

export const start = async (): Promise<void> => {
	try {
		await app.ready()
		await app.listen({ port: env.APP_PORT, host: "0.0.0.0" })
		const schema = app.swagger({ yaml: true })
		if (env.APP_ENV === "development") {
			await writeFile("openapi-backend.yaml", schema, { flag: "w+" })
		}
		app.cron.startAllJobs()
		logger.info(`Server listening on ${env.APP_URL}`)
	} catch (err) {
		logger.fatal("Error when starting server:", err instanceof Error && err.message)
	}
}

start()
