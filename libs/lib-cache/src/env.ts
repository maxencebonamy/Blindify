import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv("node", process.env, z.object({

	// Cache
	CACHE_TTL: z.coerce.number(),

	// Redis
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number(),
	REDIS_USERNAME: z.string().optional(),
	REDIS_PASSWORD: z.string().optional()

}))
