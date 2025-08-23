import type { CronDecorator } from "fastify-cron"

declare module "fastify" {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface FastifyInstance {
		cron: CronDecorator
	}
}

export * from "#/auto-loader"
export type * from "#/types"
