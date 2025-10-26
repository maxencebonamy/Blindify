import type { PlaylistObject, SimplifiedPlaylistObject } from "#/generated"
import z from "zod"

export const zPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	coverUrl: z.string().nullable(),
	trackCount: z.number().int().min(0)
})

export const zPlaylistArray = z.object({
	playlists: z.array(zPlaylist),
	lastFetchedAt: z.date()
})

export type Playlist = z.infer<typeof zPlaylist>
export type PlaylistArray = z.infer<typeof zPlaylistArray>

z.globalRegistry.add(zPlaylist, { id: "Playlist" })
z.globalRegistry.add(zPlaylistArray, { id: "PlaylistArray" })

export const fromSpotifyPlaylist = (spotifyPlaylist: SimplifiedPlaylistObject | PlaylistObject): Playlist | null => {
	const id = spotifyPlaylist.id
	const name = spotifyPlaylist.name
	const description = spotifyPlaylist.description ?? null
	const coverUrl = spotifyPlaylist.images?.[0]?.url ?? null
	const trackCount = spotifyPlaylist.tracks?.total

	if (id === undefined || name === undefined || trackCount === undefined || trackCount <= 0) {
		return null
	}

	return {
		id,
		name,
		description,
		coverUrl,
		trackCount
	}
}
