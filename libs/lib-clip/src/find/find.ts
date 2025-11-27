import type { FindClipParams } from "#/types"
import { computeSearchQuery, stringifyParams } from "#/utils/utils"
import { searchFromDeezer } from "#/search/search"
import { logger } from "lib-logger"
import { computeSimilarityScore } from "#/similarity/similarity"
import type { SearchTrack } from "#/search/search.type"
import { errors } from "lib-utils"

export const findTrack = async (params: FindClipParams): Promise<SearchTrack | null> => {
	const searchQuery = computeSearchQuery(params)

	let foundTrack: SearchTrack | null = null
	const tracks = await searchFromDeezer(searchQuery)
	for (const track of tracks) {
		if (computeSimilarityScore(track, params, false) > 0.5) {
			foundTrack = track
			break
		}
	}
	if (!foundTrack) {
		for (const track of tracks) {
			if (computeSimilarityScore(track, params, true) > 0.5) {
				foundTrack = track
				break
			}
		}
	}

	return foundTrack
}

export const findClip = async (params: FindClipParams): Promise<string | null> => {
	logger.debug(`Search clip for ${stringifyParams(params)}`)

	let track: SearchTrack | null = null
	try {
		track = await findTrack(params)
	} catch (error) {
		logger.warn(`Failed to search clip for ${stringifyParams(params)}: ${errors.from(error).message}`)
	}

	if (!track) {
		return null
	}

	logger.debug(`Clip found: ${stringifyParams(track)}`)
	return track.clip
}
