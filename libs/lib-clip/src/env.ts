import { zProvider } from "#/types"
import { createEnv } from "lib-env"
import { z } from "zod"

export const env = createEnv("node", process.env, z.object({

	// Providers
	CLIP_PROVIDERS: z.string()
		.transform(e => e.split(",").map(v => v.trim()))
		.pipe(z.array(zProvider).min(1))

}))
