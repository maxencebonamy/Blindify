import z from "zod"

export const zGame = z.object({
	playlistId: z.string(),
	nbRounds: z.union([ z.literal(10), z.literal(20), z.literal(30), z.literal(40), z.literal(50) ]),
	samplesDuration: z.union([ z.literal(5), z.literal(10), z.literal(15), z.literal(20) ]),
	trackIds: z.array(z.string())
})

export type Game = z.infer<typeof zGame>
