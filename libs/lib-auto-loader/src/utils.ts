// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DynamicImport = (path: string) => Promise<any>

export const pluralize = (count: number, word: string): string => {
	const plural = Math.abs(count) <= 1 ? word : `${word}s`
	return `${count} ${plural}`
}
