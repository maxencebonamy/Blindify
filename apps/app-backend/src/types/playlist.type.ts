import { zAlbum, zArtist, zPlatform, zPlaylist, zTrack, zUser } from "lib-platform-connector"
import z from "zod"

z.globalRegistry.add(zUser, { id: "User" })
z.globalRegistry.add(zArtist, { id: "Artist" })
z.globalRegistry.add(zAlbum, { id: "Album" })
z.globalRegistry.add(zTrack, { id: "Track" })
z.globalRegistry.add(zPlaylist, { id: "Playlist" })
z.globalRegistry.add(zPlatform, { id: "Platform" })

export const zPlaylistsWithLastFetched = z.object({
	playlists: z.array(zPlaylist),
	lastFetchedAt: z.date()
})
export type PlaylistsWithLastFetched = z.infer<typeof zPlaylistsWithLastFetched>
