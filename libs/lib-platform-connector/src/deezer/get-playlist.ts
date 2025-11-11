import { getPlaylist as getDeezerPlaylist } from "#/deezer/generated"
import { convertPlaylist } from "#/deezer/convert"
import type { PlatformConnector } from "#/types"

export const getPlaylist: PlatformConnector["getPlaylist"] = async (accessToken, playlistId) => {
	const playlist = await getDeezerPlaylist({
		path: { id: playlistId },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (!result.data || "error" in result.data) {
			throw new Error(`Failed to fetch user: ${result.data?.error.message}`)
		}
		return result.data
	})

	return convertPlaylist(playlist)
}
