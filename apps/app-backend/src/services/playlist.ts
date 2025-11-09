import type { PlaylistsWithLastFetched } from "#/types/playlist.type"
import { zPlaylistsWithLastFetched } from "#/types/playlist.type"
import { cache } from "lib-cache"
import type { Playlist } from "lib-platform-connector"
import { spotifyConnector, zPlaylist } from "lib-platform-connector"
import z from "zod"

export const getAllUserPlaylists = async (accessToken: string): Promise<PlaylistsWithLastFetched> => {
	const cacheKey = `users:${accessToken}:playlists`

	try {
		const playlists = await cache.get(cacheKey, zPlaylistsWithLastFetched)
		return playlists
	} catch {
		// Not found, continue
	}

	const playlists = await spotifyConnector.getAllUserPlaylists(accessToken)

	const playlistsWithLastFetched: PlaylistsWithLastFetched = {
		playlists,
		lastFetchedAt: new Date()
	}
	await cache.set(cacheKey, playlistsWithLastFetched)

	return playlistsWithLastFetched
}

export const invalidateUserPlaylistsCache = async (accessToken: string): Promise<void> => {
	const cacheKey = `users:${accessToken}:playlists`
	await cache.del(cacheKey)
}

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

	return spotifyConnector.getPlaylist(accessToken, playlistId)
}
