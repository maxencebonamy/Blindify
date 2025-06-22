import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import type { z } from "zod"

export const createEnv = <T>(type: "node" | "vite", env: NodeJS.ProcessEnv, schema: z.ZodSchema<T>): T => {
	if (type === "node") {
		// parse .env file using dotenv
		// dotenv-expand is used to support environment variable expansion (e.g. `APP_URL=${APP_HOST}:${APP_PORT}`)
		dotenvExpand.expand(dotenv.config())
	}

	const result = schema.safeParse(env)

	if (!result.success) {
		const message = "Failed to parse env:\n" + result.error.errors.map(e => `- ${e.path}: ${e.message}`).join("\n")
		if (type === "node") {
			// eslint-disable-next-line no-console
			console.log(message)
			process.exit(1)
		} else {
			throw new Error(message)
		}
	}

	return result.data
}
