import type { EpisodeObject, TrackObject } from "#/generated"
import { getPlaylistsTracks } from "#/generated"
import type { Track } from "#/types/track.type"
import { zTrack } from "#/types/track.type"
import { cache } from "lib-cache"
import z from "zod"

export const getAllTracksFromPlaylist = async (accessToken: string, playlistId: string): Promise<Track[]> => {
	const cacheKey = `playlists:${playlistId}:tracks`

	try {
		const tracks = await cache.get(cacheKey, z.array(zTrack))
		return tracks
	} catch {
		// Not found, continue
	}

	const tracks: Track[] = []

	const limit = 50
	let offset = 0
	let lastPage = false
	while (!lastPage) {
		const spotifyTracks = await getPlaylistsTracks({
			path: { playlist_id: playlistId },
			query: { limit, offset },
			headers: { authorization: `Bearer ${accessToken}` }
		}).then(result => {
			if (result.error) {
				throw new Error(`Failed to fetch playlist tracks: ${result.error.error.message}`)
			}
			return result.data
		})

		const tracksToAdd = (await Promise.all(spotifyTracks.items?.map(async item => {
			const spotifyTrack = item.track as ({
				type: "track"
			} & TrackObject) | ({
				type: "episode"
			} & EpisodeObject) | undefined

			if (!spotifyTrack || spotifyTrack.type === "episode") return null

			const title = spotifyTrack.name
			const artists = spotifyTrack.artists?.map(e => e.name)
			if (!title || !artists || artists.length === 0) return null

			return {
				id: spotifyTrack.id,
				title,
				artists,
				album: spotifyTrack.album?.name,
				coverUrl: spotifyTrack.album?.images[0]?.url ?? null
			}
		}) ?? [])).filter(
			(track): track is Track => track?.id !== undefined && track.album !== undefined
		)
		tracks.push(...tracksToAdd ?? [])

		offset += limit
		lastPage = spotifyTracks.next === null
	}
	await cache.set(cacheKey, tracks)

	return tracks
}
