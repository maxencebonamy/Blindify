import { searchFromDeezer } from "#/search/search"
import { computeSearchQuery } from "#/utils/utils"
import { logger } from "lib-logger"
import notFounds from "./not-founds.json"
import wrongs from "./wrongs.json"
import spotifyTracks from "./spotify.json"
import { computeSimilarityScore } from "#/similarity/similarity"

const debugNotFounds = async (): Promise<void> => {
	const array = [ ...notFounds, ...wrongs ]

	const track = array[3]
	if (!track) {
		logger.warn("Not found is undefined")
		return
	}

	const spotifyTrack = spotifyTracks.find(e => e.id === track)
	if (!spotifyTrack) {
		logger.warn("Spotify track is undefined:", track)
		return
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

debugNotFounds()
