import z from "zod"

export type Audio = {
	buffer: Buffer
	durationMs: number
}

export const zTransformParams = z.object({
	trimMs: z.number().min(0).optional(),
	fadeInMs: z.number().min(0).optional(),
	fadeOutMs: z.number().min(0).optional(),
	tempo: z.number().min(0.5).max(100).optional(),
	reversed: z.boolean().optional(),
	sampleRateHz: z.number().optional()
})
export type TransformParams = z.infer<typeof zTransformParams>
