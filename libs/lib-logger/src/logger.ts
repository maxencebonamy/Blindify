import { logConsole } from "#/console"
import { env } from "#/env"
import { logFile } from "#/file"
import type { Level } from "#/level"
import chalk from "chalk"

export const level = (): Level => {
	return env.LOG_LEVEL
}

export const trace = (...messages: unknown[]): void => {
	logConsole("TRACE", chalk.bold.gray, ...messages)
}

export const debug = (...messages: unknown[]): void => {
	logConsole("DEBUG", chalk.bold.blue, ...messages)
}

export const info = (...messages: unknown[]): void => {
	logConsole("INFO", chalk.bold.green, ...messages)
	logFile("INFO", ...messages)
}

export const warn = (...messages: unknown[]): void => {
	logConsole("WARN", chalk.bold.yellow, ...messages)
	logFile("WARN", ...messages)
}

export const error = (...messages: unknown[]): void => {
	logConsole("ERROR", chalk.bold.red, ...messages)
	logFile("ERROR", ...messages)
}

export const fatal = (...messages: unknown[]): never => {
	logConsole("FATAL", chalk.bold.red, ...messages)
	logFile("FATAL", ...messages)
	process.exit(1)
}
