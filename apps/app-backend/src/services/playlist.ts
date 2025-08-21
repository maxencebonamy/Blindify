import { getAListOfCurrentUsersPlaylists } from "#/generated"
import { zPlaylist, type Playlist } from "#/types/playlist.type"
import { cache } from "lib-cache"
import z from "zod"

export const getAllUserPlaylists = async (accessToken: string): Promise<Playlist[]> => {
	const cacheKey = `users:${accessToken}:playlists`

	try {
		const playlists = await cache.get(cacheKey, z.array(zPlaylist))
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

		const playlistsToAdd = spotifyPlaylists.items?.map(item => ({
			spotifyId: item.id,
			name: item.name,
			description: item.description ?? null,
			cover: item.images?.[0]?.url ?? null,
			totalTracks: item.tracks?.total ?? 0
		})).filter(
			(playlist): playlist is Playlist => playlist.spotifyId !== undefined && playlist.name !== undefined && playlist.totalTracks > 0
		)
		return playlistsToAdd ?? []
	}))
	playlists.push(...results.flat().sort((a, b) => a.name.localeCompare(b.name)))

	await cache.set(cacheKey, playlists)

	return playlists
}
