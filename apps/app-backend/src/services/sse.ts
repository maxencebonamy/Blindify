import type { Game } from "#/types/game.type"
import { logger } from "lib-logger"

const subscribers = new Map<string, Set<NodeJS.WritableStream>>()

export const addSubscriber = (gameId: string, stream: NodeJS.WritableStream): void => {
	if (!subscribers.has(gameId)) subscribers.set(gameId, new Set())
	subscribers.get(gameId)?.add(stream)
}

export const removeSubscriber = (gameId: string, stream: NodeJS.WritableStream): void => {
	subscribers.get(gameId)?.delete(stream)
}

export const broadcastGameUpdate = (game: Game): void => {
	const subs = subscribers.get(game.id)
	if (!subs) return
	logger.debug(`broadcast update to ${subs.size} subscribers`)
	for (const res of subs) {
		res.write(`event: update\ndata: ${JSON.stringify(game)}\n\n`)
	}
}
