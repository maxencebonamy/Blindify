import { createEnv } from "lib-env"
import z from "zod"

export const env = createEnv("node", process.env, z.object({

	// App
	APP_ENV: z.enum([ "development", "production" ]),

	// Postgres
	POSTGRES_URL: z.string()

}))
