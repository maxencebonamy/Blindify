import { convertPlaylistTrack } from "#/spotify/convert"
import { getPlaylistsTracks } from "#/spotify/generated"
import type { PlatformConnector, PlatformTrack } from "#/types"

export const getAllTracksFromPlaylist: PlatformConnector["getAllTracksFromPlaylist"] = async (accessToken, playlistId) => {
	const allTracks: PlatformTrack[] = []

	const limit = 50
	let offset = 0
	let lastPage = false

	let iterationCount = 100
	while (!lastPage && iterationCount > 0) {
		iterationCount--

		const tracks = await getPlaylistsTracks({
			path: { playlist_id: playlistId },
			headers: { authorization: `Bearer ${accessToken}` },
			query: { limit, offset }
		}).then(result => {
			if (result.error) {
				throw new Error(`Failed to fetch playlist tracks: ${result.error.error.message}`)
			}
			return result.data
		})

		allTracks.push(...tracks.items?.map(item => {
			try {
				return convertPlaylistTrack(item)
			} catch {
				return null
			}
		}).filter(track => track !== null) ?? [])

		offset += limit
		if (tracks.next === null) {
			lastPage = true
		}
	}

	return allTracks
}
