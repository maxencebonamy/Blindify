import { cache } from "lib-cache"
import type { Playlist } from "lib-platform-connector"
import { zPlaylist, connector } from "lib-platform-connector"
import z from "zod"

export const getPlaylistById = async (accessToken: string, playlistId: string): Promise<Playlist> => {
	const cacheKey = `users:${accessToken}:playlists`

	try {
		const allPlaylists = await cache.get(cacheKey, z.array(zPlaylist))
		const playlist = allPlaylists.find(e => e.id === playlistId)
		if (playlist) {
			return playlist
		}
	} catch {
		// Not found, continue
	}

	return connector("spotify").getPlaylist(accessToken, playlistId)
}
