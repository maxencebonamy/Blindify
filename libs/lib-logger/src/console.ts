import { env } from "#/env"
import { isLevelEnabled, type Level } from "#/level"
import { currentTimestamp, getCaller, stringify } from "#/utils"
import type { ChalkInstance } from "chalk"
import chalk from "chalk"

export const logConsole = (level: Level, chalkize: ChalkInstance, ...messages: unknown[]): void => {
	if (!isLevelEnabled(level, env.LOG_LEVEL)) return

	const timestamp = currentTimestamp()
	const caller = getCaller()

	// eslint-disable-next-line no-console
	console.log(`${chalk.dim(timestamp)} ${chalkize(`[${level}]`)} ${messages.map(stringify).join(" ")} ${chalk.dim.italic(`(${caller})`)}`)
}
