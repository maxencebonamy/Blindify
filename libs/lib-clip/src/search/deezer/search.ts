import type { DeezerSearchResponse } from "#/search/deezer/types"
import { zDeezerSearchResponse } from "#/search/deezer/types"

const getSearchUrl = (searchQuery: string): string => {
	return `https://api.deezer.com/search/track?q=${encodeURIComponent(searchQuery)}`
}

export const searchFromDeezer = async (searchQuery: string): Promise<DeezerSearchResponse> => {
	const searchUrl = getSearchUrl(searchQuery)

	const tracks = await fetch(searchUrl).then(result => {
		if (!result.ok) {
			throw new Error(`Failed to fetch tracks: ${result.statusText}`)
		}
		return result.json()
	})

	return zDeezerSearchResponse.parse(tracks)
}
