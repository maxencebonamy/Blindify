import type { FindClipParams } from "#/types"

const BAN_WORDS = [ "(", ")", ",", ".", "&", "with", "ft", "feat", "featuring" ]

export const normalizeString = (value: string): string => {
	return value.toLowerCase().replace(/\s+/g, " ").trim()
}

export const computeSearchQuery = ({ title, artist }: FindClipParams): string => {
	for (const word of BAN_WORDS) {
		title = title.replace(word, "")
	}
	return normalizeString(`${title} ${artist}`)
}

export const stringifyParams = ({ title, artist, album }: FindClipParams): string => {
	return `${artist} - ${title} (${album})`
}
