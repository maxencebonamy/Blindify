import z from "zod"

export const zPlaylist = z.object({
	name: z.string(),
	description: z.string().nullable(),
	cover: z.string().nullable(),
	trackIds: z.array(z.string())
})

export type Playlist = z.infer<typeof zPlaylist>
