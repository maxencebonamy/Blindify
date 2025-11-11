import { createEnv } from "lib-env"
import z from "zod"

export const env = createEnv("node", process.env, z.object({

	// Postgres
	POSTGRES_URL: z.string()

}))
