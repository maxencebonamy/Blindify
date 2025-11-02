import type { AppleSearchResponse } from "#/search/apple/types"
import { zAppleSearchResponse } from "#/search/apple/types"

const getSearchUrl = (searchQuery: string): string => {
	return `https://itunes.apple.com/search?entity=song&term=${encodeURIComponent(searchQuery)}`
}

export const searchFromApple = async (searchQuery: string): Promise<AppleSearchResponse> => {
	const searchUrl = getSearchUrl(searchQuery)

	const tracks = await fetch(searchUrl).then(result => {
		if (!result.ok) {
			throw new Error(`Failed to fetch tracks: ${result.statusText}`)
		}
		return result.json()
	})

	return zAppleSearchResponse.parse(tracks)
}
