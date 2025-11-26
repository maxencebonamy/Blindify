import z from "zod"

export const zSample = z.object({
	id: z.string(),
	order: z.number().int().min(0),
	clipUrl: z.string()
})

export const zSampleMinimal = zSample.pick({
	id: true,
	order: true
})

export type Sample = z.infer<typeof zSample>
export type SampleMinimal = z.infer<typeof zSampleMinimal>
