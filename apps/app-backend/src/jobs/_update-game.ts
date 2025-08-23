import { broadcastGameUpdate } from "#/services/sse"
import { get } from "http"
import { set } from "zod"

const gameWorker = async (): Promise<void> => {
	const activeGameIds = await getActiveGameIds() // liste de tes parties en cours

	const now = Date.now()
	for (const gameId of activeGameIds) {
		const game = await get(`game:${gameId}`, gameSchema).catch(() => null)
		if (!game?.nextActionAt || game.nextActionAt > now) continue

		if (game.state === "waiting") {
			game.state = "playing_sample"
			game.nextActionAt = now + game.sampleDurationMs
		} else if (game.state === "playing_sample") {
			game.state = "showing_answer"
			game.nextActionAt = now + 10000 // 10s pause
		} else if (game.state === "showing_answer") {
			if (game.currentIndex + 1 < game.tracks.length) {
				game.currentIndex++
				game.state = "playing_sample"
				game.nextActionAt = now + game.sampleDurationMs
			} else {
				game.state = "finished"
				game.nextActionAt = undefined
			}
		}

		await set(`game:${gameId}`, game)
		broadcastGameUpdate(gameId, game)
	}
}
