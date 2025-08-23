export const pluralize = (count: number, word: string): string => {
	const plural = count <= 1 ? word : `${word}s`
	return `${count} ${plural}`
}
