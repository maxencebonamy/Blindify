import type { FindClipParams } from "#/types"

export const normalizeString = (value: string): string => {
	return value.toLowerCase().replace(/\s+/g, " ").trim()
}

export const computeSearchQuery = ({ title }: FindClipParams): string => {
	return normalizeString(`${title}`)
}
