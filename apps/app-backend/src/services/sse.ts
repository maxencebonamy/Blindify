import type { Game } from "#/types/game.type"

const subscribers = new Map<string, Set<NodeJS.WritableStream>>()

export const addSubscriber = (gameId: string, stream: NodeJS.WritableStream): void => {
	if (!subscribers.has(gameId)) subscribers.set(gameId, new Set())
	subscribers.get(gameId)?.add(stream)
}

export const removeSubscriber = (gameId: string, stream: NodeJS.WritableStream): void => {
	subscribers.get(gameId)?.delete(stream)
}

export const broadcastGameUpdate = (gameId: string, game: Game): void => {
	const subs = subscribers.get(gameId)
	if (!subs) return
	for (const res of subs) {
		res.write("event: update\n")
		res.write(`data: ${JSON.stringify(game)}\n\n`)
	}
}
