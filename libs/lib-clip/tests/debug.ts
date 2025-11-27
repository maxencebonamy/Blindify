import { searchFromDeezer } from "#/search/search"
import { computeSearchQuery } from "#/utils/utils"
import { logger } from "lib-logger"
import notFounds from "$/data/not-founds.json"
import wrongs from "$/data/wrongs.json"
import spotifyTracks from "$/data/spotify.json"
import { computeSimilarityScore } from "#/similarity/similarity"

const processArray = async (array: string[]): Promise<void> => {
	for (const id of array) {
		const spotifyTrack = spotifyTracks.find(e => e.id === id)
		if (!spotifyTrack) {
			logger.warn("Spotify track not found:", id)
			continue
		}

		const params = {
			title: spotifyTrack?.title ?? "",
			album: spotifyTrack?.album.name ?? "",
			artist: spotifyTrack?.artists.map(e => e.name).join(", ") ?? ""
		}
		logger.info("Debug not found:", JSON.stringify(params))
		const searchQuery = computeSearchQuery(params)
		logger.info(searchQuery)

		const result = await searchFromDeezer(searchQuery)
		logger.info(result)

		const scores = result.map(e => computeSimilarityScore(e, params, false))
		logger.info(scores)
	}
}

const debug = async (): Promise<void> => {
	logger.info("Not founds")
	await processArray(notFounds)

	logger.info("Wrongs")
	await processArray(wrongs)
}

debug()
