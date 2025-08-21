import { zGame } from "#/types/game.type"
import { generateUUID } from "#/utils/random"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { cache } from "lib-cache"
import z from "zod"

export const schema = {
	operationId: "getGameSample",
	description: "Get a sample of a game",
	tags: [ "games" ],
	querystring: z.object({
		gameId: z.string(),
		sampleIndex: z.number().int().min(1).max(50)
	}),
	response: {
		200: z.object({
			id: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async request => {
	const gameId = generateUUID()

	const game = await cache.get(`game:${gameId}`, zGame)

	return { id: gameId }
}
