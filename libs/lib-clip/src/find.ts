import type { FindClipParams } from "#/types"
import { computeSearchQuery } from "#/utils"
import { cache } from "lib-cache"
import z from "zod"
import { env } from "#/env"
import { searchFromProvider } from "#/search/search"
import type { SearchTrack } from "#/search/common"
import { logger } from "lib-logger"
import { trackSimilarity } from "#/similarity"

const CACHE_TTL = 15 * 60 // 15 minutes

export const findClip = async (params: FindClipParams): Promise<string | null> => {
	const searchQuery = computeSearchQuery(params)
	const cacheKey = `clip:${encodeURIComponent(searchQuery)}`

	if (env.CLIP_CACHING) {
		try {
			return await cache.get(cacheKey, z.string().nullable())
		} catch {
			// Not found, continue
		}
	}

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
		if (env.CLIP_CACHING) await cache.set(cacheKey, null)
		return null
	}

	logger.debug(`Clip found: ${foundTrack.artist} - ${foundTrack.title} (${foundTrack.album})`)
	if (env.CLIP_CACHING) await cache.set(cacheKey, foundTrack.clip, CACHE_TTL)
	return foundTrack.clip
}
