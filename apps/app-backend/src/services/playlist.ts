import { getAListOfCurrentUsersPlaylists, getPlaylist } from "#/generated"
import type { PlaylistArray } from "#/types/playlist.type"
import { fromSpotifyPlaylist, zPlaylist, zPlaylistArray, type Playlist } from "#/types/playlist.type"
import { cache } from "lib-cache"
import z from "zod"

export const getAllUserPlaylists = async (accessToken: string): Promise<PlaylistArray> => {
	const cacheKey = `users:${accessToken}:playlists`

	try {
		const playlists = await cache.get(cacheKey, zPlaylistArray)
		return playlists
	} catch {
		// Not found, continue
	}

	const playlists: Playlist[] = []

	const totalSpotifyPlaylists = await getAListOfCurrentUsersPlaylists({
		query: { limit: 1 },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch total user playlists: ${result.error.error.message}`)
		}
		return result.data.total
	})

	const limit = 50
	const totalPages = Math.ceil(totalSpotifyPlaylists / limit)

	const results = await Promise.all(Array.from({ length: totalPages }).map(async (_, i) => {
		const offset = limit * i
		const spotifyPlaylists = await getAListOfCurrentUsersPlaylists({
			query: { limit, offset },
			headers: { authorization: `Bearer ${accessToken}` }
		}).then(result => {
			if (result.error) {
				throw new Error(`Failed to fetch user playlists: ${result.error.error.message}`)
			}
			return result.data
		})

		const playlistsToAdd = spotifyPlaylists.items?.map(fromSpotifyPlaylist).filter(e => e !== null)
		return playlistsToAdd ?? []
	}))
	playlists.push(...results.flat().sort((a, b) => a.name.localeCompare(b.name)))

	const playlistArray: PlaylistArray = {
		playlists,
		lastFetchedAt: new Date()
	}
	await cache.set(cacheKey, playlistArray)

	return playlistArray
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

	const spotifyPlaylist = await getPlaylist({
		path: { playlist_id: playlistId },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch playlist: ${result.error.error.message}`)
		}
		return result.data
	})

	const playlist = fromSpotifyPlaylist(spotifyPlaylist)
	if (playlist === null) {
		throw new Error("Failed to convert Spotify playlist")
	}

	return playlist
}
