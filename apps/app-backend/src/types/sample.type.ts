import z from "zod"

export const zSampleMinimal = z.object({
	id: z.string(),
	order: z.number().int().min(0)
})

export const zSample = z.object({
	id: z.string(),
	order: z.number().int().min(0),
	clipUrl: z.string()
})

export type SampleMinimal = z.infer<typeof zSampleMinimal>
export type Sample = z.infer<typeof zSample>

z.globalRegistry.add(zSampleMinimal, { id: "SampleMinimal" })
z.globalRegistry.add(zSample, { id: "Sample" })
