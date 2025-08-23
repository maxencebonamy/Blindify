import z from "zod"

export const zTrack = z.object({
	id: z.string(),
	title: z.string(),
	artists: z.array(z.string()).min(1),
	album: z.string(),
	coverUrl: z.string().nullable()
})

export type Track = z.infer<typeof zTrack>

z.globalRegistry.add(zTrack, { id: "Track" })
