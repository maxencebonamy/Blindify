import { convertPlaylist } from "#/spotify/convert"
import { getPlaylist as getSpotifyPlaylist } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"

export const getPlaylist: PlatformConnector["getPlaylist"] = async (accessToken, playlistId) => {
	const playlist = await getSpotifyPlaylist({
		path: { playlist_id: playlistId },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch playlist: ${result.error.error.message}`)
		}
		return result.data
	})

	return convertPlaylist(playlist)
}
