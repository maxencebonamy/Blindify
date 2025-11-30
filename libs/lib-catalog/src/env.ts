import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv("node", process.env, z.object({

	// LastFM
	LASTFM_API_KEY: z.string()

}))
