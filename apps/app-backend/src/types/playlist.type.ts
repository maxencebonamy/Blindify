import z from "zod"

export const zPlaylist = z.object({
	spotifyId: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	cover: z.string().nullable(),
	totalTracks: z.number().int()
})

export type Playlist = z.infer<typeof zPlaylist>
