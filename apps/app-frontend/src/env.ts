import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv("vite", import.meta.env, z.object({
	// Backend
	VITE_BACKEND_URL: z.string()
}))
