import type { FindClipParams } from "#/types"
import { computeSearchQuery } from "#/utils"
import { env } from "#/env"
import { searchFromProvider } from "#/search/search"
import type { SearchTrack } from "#/search/common"
import { logger } from "lib-logger"
import { trackSimilarity } from "#/similarity"

export const findClip = async (params: FindClipParams): Promise<string | null> => {
	const searchQuery = computeSearchQuery(params)

	logger.debug(`Search clip: ${params.artist} - ${params.title} (${params.album})`)
	let foundTrack: SearchTrack | null = null
	for (const provider of env.CLIP_PROVIDERS) {
		try {
			const tracks = await searchFromProvider(provider, searchQuery)
			for (const track of tracks) {
				if (trackSimilarity(track, params) > 0.5) {
					foundTrack = track
					break
				}
			}
			if (foundTrack) break
		} catch {
			logger.warn(`failed to search clip from provider ${provider}: ${params.artist} - ${params.title} (${params.album})`)
		}
	}

	if (!foundTrack) {
		logger.debug("Clip not found")
		return null
	}

	logger.debug(`Clip found: ${foundTrack.artist} - ${foundTrack.title} (${foundTrack.album})`)
	return foundTrack.clip
}
