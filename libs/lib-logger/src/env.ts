import { levels } from "#/level"
import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv(process.env, z.object({

	// Logs
	LOG_LEVEL: z.enum(levels).default("INFO")

}))
