import { PlatformConnectorError } from "#/error"
import { convertTrack } from "#/spotify/convert"
import { getPlaylistsTracks } from "#/spotify/generated"
import type { PlatformConnector, Track } from "#/types"
import { logger } from "lib-logger"
import { errors } from "lib-utils"

export const getAllTracksFromPlaylist: PlatformConnector["getAllTracksFromPlaylist"] = async (accessToken, playlistId) => {
	const allTracks: Track[] = []

	const limit = 50
	let offset = 0
	let lastPage = false

	let iterationCount = 100
	while (!lastPage && iterationCount > 0) {
		iterationCount--

		const tracks = await getPlaylistsTracks({
			headers: { authorization: `Bearer ${accessToken}` },
			path: { playlist_id: playlistId },
			query: { limit, offset }
		}).then(result => {
			if (result.error) {
				throw new PlatformConnectorError(`Failed to get playlist ${playlistId} tracks: ${result.error.error.message}`)
			}
			return result.data
		})

		allTracks.push(...tracks.items?.map(item => {
			try {
				return convertTrack(item)
			} catch (error) {
				logger.warn(`Failed to convert track: ${errors.from(error).message} (${JSON.stringify(item)})`)
				return null
			}
		}).filter(track => track !== null) ?? [])

		offset += limit
		if (tracks.next === null) {
			lastPage = true
		}
	}
	if (iterationCount === 0) {
		logger.warn(`Max iterations count has been reached when getting all tracks from playlist ${playlistId}`)
	}

	return allTracks
}
