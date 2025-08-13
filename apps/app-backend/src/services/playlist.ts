import type { TrackObject } from "#/generated"
import { getPlaylistCover, getPlaylist as getSpotifyPlaylist } from "#/generated"
import { getSample } from "#/services/sample"
import { zPlaylist, type Playlist } from "#/types/playlist.type"
import type { Track } from "#/types/track.type"
import { cache } from "lib-cache"

export const getPlaylist = async (playlistId: string, accessToken: string): Promise<Playlist | null> => {
	try {
		const playlist = await cache.get(`playlist:${playlistId}`, zPlaylist)
		return playlist
	} catch {
		// Not found in cache
	}

	const spotifyPlaylist = await getSpotifyPlaylist({
		path: { playlist_id: playlistId },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch playlist: ${result.error.error.message}`)
		}
		if (!result.data.name || result.data.tracks?.items?.length === 0) {
			throw new Error("Playlist not found or empty")
		}
		return result.data
	})
	const playlistName = spotifyPlaylist.name ?? ""
	const playlistTracks = spotifyPlaylist.tracks?.items ?? []

	const cover = await getPlaylistCover({
		path: { playlist_id: playlistId },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch playlist cover: ${result.error.error.message}`)
		}
		if (!result.data || result.data.length === 0) {
			return null
		}
		return result.data[0].url
	})

	const tracks = playlistTracks.map(item => item.track as unknown as TrackObject)
	const trackIds = tracks.map(track => track.id ?? null).filter(id => id !== null)

	const playlist: Playlist = {
		name: playlistName,
		description: spotifyPlaylist.description ?? null,
		cover: cover,
		trackIds: trackIds
	}
	await cache.set(`playlist:${playlistId}`, playlist)

	await Promise.all(tracks.map(async track => {
		const title = track.name ?? ""
		const artists = track.artists?.map(artist => artist.name ?? null).filter(name => name !== null) ?? []
		const artist = artists.join(", ")
		const sample = await getSample(title, artist)

		await cache.set(`track:${track.id}`, {
			title,
			artist,
			sample
		} satisfies Track)
	}))

	return playlist
}
