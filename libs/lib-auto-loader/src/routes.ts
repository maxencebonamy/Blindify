import type { AutoLoaderSchema, AutoLoaderHandler } from "#/types"
import { logger } from "lib-logger"
import path from "path"
import { pathToFileURL } from "url"
import fs from "fs"

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
			const newRoutes = await loadRoutes(fullPath, `${basePath}/${entry.name}`)
			routes.push(...newRoutes)
		} else if (entry.isFile() && !entry.name.startsWith("_") && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
			const method = entry.name.replace(/\.ts$/, "").replace(/\.js$/, "").toUpperCase()
			const url = basePath || "/"

			const mod = await import(pathToFileURL(fullPath).href)
			if (!mod.schema || !mod.handler) {
				throw new Error(`Missing schema or handler export in ${fullPath}`)
			}

			const debug = mod.debug !== undefined && typeof mod.debug === "boolean" && mod.debug

			routes.push({
				method,
				url,
				schema: mod.schema,
				handler: async (...params) => {
					if (!debug) return mod.handler(...params)

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

	return routes
}
