export const levels = [ "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "OFF" ] as const

export type Level = typeof levels[number]

export const isLevelEnabled = (level: Level, minLevel: Level): boolean => {
	return levels.indexOf(level) >= levels.indexOf(minLevel)
}
