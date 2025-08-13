import z from "zod"

export const zTrack = z.object({
	title: z.string(),
	artist: z.string(),
	sample: z.string().nullable()
})

export type Track = z.infer<typeof zTrack>
