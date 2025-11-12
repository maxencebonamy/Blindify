import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv("node", process.env, z.object({

	// Cache
	CACHE_TTL: z.coerce.number(),

	// Redis
	REDIS_URL: z.string()

}))
