import z from "zod"

export const zPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	coverUrl: z.string().nullable(),
	totalTracks: z.number().int().min(0)
})

export type Playlist = z.infer<typeof zPlaylist>
