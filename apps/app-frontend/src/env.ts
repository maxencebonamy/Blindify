import { createEnv } from "lib-env"
import { z } from "zod"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const runtimeConfig = typeof window !== "undefined" ? window.RUNTIME_CONFIG : undefined

export const env = createEnv("vite", runtimeConfig || import.meta.env, z.object({
	// App
	VITE_APP_REDIRECT_URL: z.string(),

	// Backend
	VITE_BACKEND_URL: z.string()
}))
