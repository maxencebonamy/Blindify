import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import path from "path"
import fs from "fs"
import { fileURLToPath, pathToFileURL } from "url"
import type { Handler, Schema } from "#/types/fastify"
import { logger } from "lib-logger"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const routesDir = __dirname

type Endpoint = {
	method: string
	url: string
	schema: Schema
	handler: Handler
}

export const endpoints: Endpoint[] = []

const loadRoutesFromDir = async (dir: string, basePath = ""): Promise<void> => {
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isDirectory()) {
			await loadRoutesFromDir(fullPath, `${basePath}/${entry.name}`)
		} else if (entry.isFile() && entry.name !== "routes.ts" && entry.name.endsWith(".ts")) {
			const method = entry.name.replace(/\.ts$/, "").toUpperCase()
			const url = basePath || "/"

			const mod = await import(pathToFileURL(fullPath).href)
			if (!mod.schema || !mod.handler) {
				throw new Error(`Missing schema or handler export in ${fullPath}`)
			}

			endpoints.push({
				method,
				url,
				schema: mod.schema,
				handler: async (...params) => {
					logger.debug(`Entering ${method} ${url}`)
					const result = await mod.handler(...params)
					logger.debug(`Leaving ${method} ${url} with result:`, result)
					return result
				}
			})
		}
	}
}

export const routes = async (app: FastifyInstance): Promise<void> => {
	await loadRoutesFromDir(routesDir)
	await Promise.all(endpoints.map(e => app.withTypeProvider<ZodTypeProvider>().route(e)))
}
