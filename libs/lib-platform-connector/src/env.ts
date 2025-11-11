import { createEnv } from "lib-env"
import z from "zod"

export const env = createEnv("node", process.env, z.object({

	// Spotify
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string()

}))
