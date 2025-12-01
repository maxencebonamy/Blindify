export const scramble = <T>(array: T[]): void => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j] as T, array[i] as T ]
	}
}

export const dedupe = <T>(array: T[]): T[] => {
	const seen = new Set<T>()
	return array.filter(e => {
		if (seen.has(e)) return false
		seen.add(e)
		return true
	})
}

export const dedupeBy = <T extends Record<string, unknown>, K extends keyof T>(array: T[], key: K): T[] => {
	const seen = new Set<T[K]>()
	return array.filter(e => {
		if (seen.has(e[key])) return false
		seen.add(e[key])
		return true
	})
}
