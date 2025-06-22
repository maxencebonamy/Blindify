import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv(process.env, z.object({
	// App
	APP_HOST: z.string(),
	APP_PORT: z.coerce.number(),
	APP_URL: z.string(),
	ALLOWED_ORIGINS: z.string(),

	// Spotify
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
	SPOTIFY_REDIRECT_URI: z.string()
}))
