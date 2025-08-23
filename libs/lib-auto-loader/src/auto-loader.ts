import type { FastifyPluginAsync } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import fp from "fastify-plugin"
import { loadRoutes } from "#/routes"
import fastifyCron from "fastify-cron"
import { loadJobs } from "#/jobs"
import { logger } from "lib-logger"
import { pluralize } from "#/utils"

type AutoLoaderOptions = {
	routesDir: string
	jobsDir: string
}

const autoLoaderAsync: FastifyPluginAsync<AutoLoaderOptions> = async (app, options) => {
	const routes = await loadRoutes(options.routesDir)
	await Promise.all(routes.map(e => app.withTypeProvider<ZodTypeProvider>().route(e)))

	const jobs = await loadJobs(options.jobsDir)
	app.register(fastifyCron, {
		jobs: jobs.map(job => ({ cronTime: job.cron, onTick: job.task }))
	})

	logger.info(`Loaded ${pluralize(routes.length, "route")} and ${pluralize(jobs.length, "job")}`)
}

export const autoLoader = fp(autoLoaderAsync)
