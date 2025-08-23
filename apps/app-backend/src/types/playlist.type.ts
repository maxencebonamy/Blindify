import type { PlaylistObject, SimplifiedPlaylistObject } from "#/generated"
import z from "zod"

export const zPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	coverUrl: z.string().nullable(),
	trackCount: z.number().int().min(0)
})

export type Playlist = z.infer<typeof zPlaylist>

z.globalRegistry.add(zPlaylist, { id: "Playlist" })

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
