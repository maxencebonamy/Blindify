import { convertPlaylist } from "#/deezer/convert"
import { getCurrentUserPlaylists } from "#/deezer/generated"
import type { PlatformConnector } from "#/types"

export const getAllUserPlaylists: PlatformConnector["getAllUserPlaylists"] = async accessToken => {
	const playlists = await getCurrentUserPlaylists({
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (!result.data || "error" in result.data) {
			throw new Error(`Failed to fetch user: ${result.data?.error.message}`)
		}
		return result.data
	})

	return playlists.data?.map(e => convertPlaylist(e)) ?? []
}
