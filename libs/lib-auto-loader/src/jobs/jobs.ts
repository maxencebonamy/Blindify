import { logger } from "lib-logger"
import path from "path"
import { pathToFileURL } from "url"
import fs from "fs"
import type { AutoLoaderTask } from "#/types"
import type { DynamicImport } from "#/utils"

type Job = {
	cron: string
	task: AutoLoaderTask
}

export const loadJobs = async (dir: string, dynamicImport: DynamicImport = p => import(p)): Promise<Job[]> => {
	const jobs: Job[] = []
	const entries = fs.readdirSync(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isFile() && !entry.name.startsWith("_") && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
			const name = entry.name.replace(/\.ts$/, "").replace(/\.js$/, "")

			const mod = await dynamicImport(pathToFileURL(fullPath).href)
			if (!mod.cron || !mod.task) {
				throw new Error(`Missing cron or task export in ${fullPath}`)
			}

			jobs.push({
				cron: mod.cron,
				task: async (...params) => {
					if (logger.level() !== "TRACE") return mod.task(...params)

					logger.trace(`Executing job ${name}`)
					const start = performance.now()
					const result = await mod.task(...params)

					const end = performance.now()
					const durationMs = end - start
					logger.trace(`Finished job ${name} (${durationMs.toFixed(0)}ms)`)
					return result
				}
			})
		}
	}

	return jobs
}
