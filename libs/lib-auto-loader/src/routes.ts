import type { AutoLoaderSchema, AutoLoaderHandler } from "#/types"
import { logger } from "lib-logger"
import path from "path"
import { pathToFileURL } from "url"
import fs from "fs"
import z from "zod"

type Route = {
	method: string
	url: string
	schema: AutoLoaderSchema
	handler: AutoLoaderHandler
}

export const loadRoutes = async (dir: string, basePath = ""): Promise<Route[]> => {
	const routes: Route[] = []
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isDirectory()) {
			let trimmedName = entry.name
			if (trimmedName.startsWith("_")) {
				trimmedName = `:${trimmedName.slice(1)}`
			}
			const newRoutes = await loadRoutes(fullPath, `${basePath}/${trimmedName}`)
			routes.push(...newRoutes)
		} else if (entry.isFile() && !entry.name.startsWith("_") && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
			const method = entry.name.replace(/\.ts$/, "").replace(/\.js$/, "").toUpperCase()
			const url = basePath || "/"

			const mod = await import(pathToFileURL(fullPath).href)
			const schema: AutoLoaderSchema = mod.schema
			const handler: AutoLoaderHandler<AutoLoaderSchema> = mod.handler
			if (!schema || !handler) {
				throw new Error(`Missing schema or handler export in ${fullPath}`)
			}

			if (schema.auth) {
				if (schema.response) {
					(schema.response as Record<string, z.ZodTypeAny>)["401"] = z.object({ message: z.string() })
				} else {
					schema.response = { 401: z.object({ message: z.string() }) }
				}
			}

			if (schema.response) {
				(schema.response as Record<string, z.ZodTypeAny>)["500"] = z.object({ message: z.string() })
			} else {
				schema.response = { 500: z.object({ message: z.string() }) }
			}

			routes.push({
				method,
				url,
				schema: schema,
				handler: async (request, reply) => {
					let accessToken: string | undefined = undefined
					if (schema.auth) {
						accessToken = request.cookies["access_token"]
						if (!accessToken) {
							return reply.code(401).send({ message: "Access token missing" })
						}
					}

					try {
						if (logger.level() !== "DEBUG") return mod.handler({ ...request, accessToken }, reply)

						logger.debug(`Entering ${method} ${url}`)
						const start = performance.now()
						const result = await mod.handler({ ...request, accessToken }, reply)

						const end = performance.now()
						const durationMs = end - start
						logger.debug(`Leaving ${method} ${url} (${durationMs.toFixed(0)}ms)`)
						return result
					} catch (error) {
						logger.error(`Error in ${method} ${url}: ${(error as Error).message}`)
						return reply.code(500).send({ message: "Internal server error" })
					}
				}
			})
		}
	}

	return routes
}
