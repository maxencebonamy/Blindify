import { zPlaylist } from "lib-platform-connector"
import z from "zod"

export const zPlaylistsWithLastFetched = z.object({
	playlists: z.array(zPlaylist),
	lastFetchedAt: z.date()
})
export type PlaylistsWithLastFetched = z.infer<typeof zPlaylistsWithLastFetched>
