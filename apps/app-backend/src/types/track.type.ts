import z from "zod"

export const zTrack = z.object({
	spotifyId: z.string(),
	title: z.string(),
	artist: z.string(),
	album: z.string(),
	cover: z.string().nullable(),
	sample: z.string().nullable()
})

export type Track = z.infer<typeof zTrack>
