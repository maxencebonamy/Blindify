import type { FastifyPluginAsync } from "fastify"
import path from "path"
import fs from "fs"
import { pathToFileURL } from "url"
import type { AutoLoaderHandler, AutoLoaderSchema } from "#/types"
import { logger } from "lib-logger"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import fp from "fastify-plugin"

type Endpoint = {
	method: string
	url: string
	schema: AutoLoaderSchema
	handler: AutoLoaderHandler
}

const endpoints: Endpoint[] = []

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
					const start = performance.now()
					const result = await mod.handler(...params)
					const end = performance.now()
					const durationMs = end - start
					logger.debug(`Leaving ${method} ${url} (${durationMs.toFixed(0)}ms)`)
					return result
				}
			})
		}
	}
}

type AutoLoaderOptions = {
	routesDir: string
}

const autoLoaderAsync: FastifyPluginAsync<AutoLoaderOptions> = async (app, options) => {
	await loadRoutesFromDir(options.routesDir)
	await Promise.all(endpoints.map(e => app.withTypeProvider<ZodTypeProvider>().route(e)))
}

export const autoLoader = fp(autoLoaderAsync)
