import { PlatformConnectorError } from "#/error"
import { convertPlaylist } from "#/spotify/convert"
import { getPlaylist as getSpotifyPlaylist } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"
import { errors } from "lib-utils"

export const getPlaylist: PlatformConnector["getPlaylist"] = async (accessToken, playlistId) => {
	const playlist = await getSpotifyPlaylist({
		headers: { authorization: `Bearer ${accessToken}` },
		path: { playlist_id: playlistId }
	}).then(result => {
		if (result.error) {
			throw new PlatformConnectorError(`Failed to get playlist ${playlistId}: ${result.error.error.message}`)
		}
		return result.data
	})

	try {
		return convertPlaylist(playlist)
	} catch (error) {
		throw new PlatformConnectorError(`Failed to convert playlist: ${errors.from(error).message} (${JSON.stringify(playlist)})`)
	}
}
