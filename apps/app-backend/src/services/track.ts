import type { EpisodeObject, TrackObject } from "#/generated"
import { getPlaylistsTracks } from "#/generated"
import type { Track } from "#/types/track.type"
import { zTrack } from "#/types/track.type"
import { cache } from "lib-cache"
import z from "zod"

export const getAllTracksFromPlaylist = async (accessToken: string, spotifyPlaylistId: string): Promise<Track[]> => {
	const cacheKey = `playlists:${spotifyPlaylistId}:tracks`

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
			path: { playlist_id: spotifyPlaylistId },
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
			const artist = spotifyTrack.artists?.map(e => e.name).join(", ")
			if (!title || !artist || artist.length === 0) return null

			// const sample = await getSample(title, artist)

			return {
				spotifyId: spotifyTrack.id,
				title,
				artist,
				album: spotifyTrack.album?.name,
				cover: spotifyTrack.album?.images[0]?.url ?? null,
				sample: null as string | null
			}
		}) ?? [])).filter(
			(track): track is Track => track?.spotifyId !== undefined && track.album !== undefined
		)
		tracks.push(...tracksToAdd ?? [])

		offset += limit
		lastPage = spotifyTracks.next === null
	}

	await cache.set(cacheKey, tracks)

	return tracks
}
