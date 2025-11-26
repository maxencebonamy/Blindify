import z from "zod"

export const zApiError = z.object({
	message: z.string()
})

export type ApiError = z.infer<typeof zApiError>
