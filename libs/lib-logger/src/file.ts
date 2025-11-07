import path from "path"
import fs from "fs"
import { currentTimestamp, stringify } from "#/utils"
import type { Level } from "#/level"

export const logFile = (level: Level, ...messages: unknown[]): void => {
	const logDirectory = path.join(process.cwd(), "logs")

	// Check if log directory exists
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory)
	}

	// Get current timestamp
	const timestamp = currentTimestamp()
	const fileName = timestamp.split(" ")?.[0]?.replace(/\//g, "-") ?? "unknown-date"
	const logFile = path.join(logDirectory, `${fileName}.log`)

	// Write log to file
	fs.appendFileSync(logFile, `${timestamp} [${level}] ${messages.map(stringify).join(" ")}\n`)
}
