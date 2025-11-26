import { cache } from "lib-cache"
import type { Playlist } from "lib-platform-connector"
import { zPlaylist, connector } from "lib-platform-connector"

export const getPlaylistById = async (accessToken: string, playlistId: string): Promise<Playlist> => {
	const cacheKey = `playlists:${playlistId}`

	try {
		return await cache.get(cacheKey, zPlaylist)
	} catch {
		// Not found, continue
	}

	const playlist = await connector("spotify").getPlaylist(accessToken, playlistId)
	await cache.set(cacheKey, playlist)
	return playlist
}
