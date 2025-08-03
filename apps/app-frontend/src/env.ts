import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv("vite", import.meta.env, z.object({
	// App
	VITE_APP_REDIRECT_URL: z.string(),

	// Backend
	VITE_BACKEND_URL: z.string()
}))
