import { cache } from "lib-cache"
import type { Track } from "lib-platform-connector"
import { connector, zTrack } from "lib-platform-connector"
import z from "zod"

export const getAllTracksFromPlaylist = async (accessToken: string, playlistId: string): Promise<Track[]> => {
	const cacheKey = `playlists:${playlistId}:tracks`

	try {
		const tracks = await cache.get(cacheKey, z.array(zTrack))
		return tracks
	} catch {
		// Not found, continue
	}

	const tracks = await connector("spotify").getAllTracksFromPlaylist(accessToken, playlistId)
	await cache.set(cacheKey, tracks)

	return tracks
}
