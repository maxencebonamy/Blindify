import { getAllGames, getGameById } from "#/services/game"
import { broadcastGameUpdate } from "#/services/sse"
import type { AutoLoaderTask } from "lib-auto-loader"
import { cache } from "lib-cache"
import { zCatalogTrack } from "lib-catalog"
import z from "zod"

export const cron = "* * * * * *"

export const task: AutoLoaderTask = async () => {
	const activeGames = await getAllGames()

	const now = Date.now()
	for (const { id } of activeGames) {
		const game = await getGameById(id).catch(() => null)
		if (game === null) continue

		if (game.status === "ready") {
			game.status = "listening"
			game.nextActionAt = new Date(now + game.settings.sampleDurationMs)
			game.currentTrack = null
			const sample = game.samples[game.currentSampleIndex]
			if (sample) game.currentSample = await cache.get(`clip:${sample.id}`, z.string())
		} else if (!game.nextActionAt || game.nextActionAt.getTime() > now) {
			continue
		} else if (game.status === "listening") {
			game.status = "revealing"
			game.nextActionAt = new Date(now + 10 * 1000) // 10 seconds
			const sample = game.samples[game.currentSampleIndex]
			if (sample) game.currentTrack = await cache.get(`track:${sample.id}`, zCatalogTrack)
		} else if (game.status === "revealing") {
			if (game.currentSampleIndex + 1 < game.samples.length) {
				game.currentSampleIndex++
				game.status = "listening"
				game.nextActionAt = new Date(now + game.settings.sampleDurationMs)
				game.currentTrack = null
				const sample = game.samples[game.currentSampleIndex]
				if (sample) game.currentSample = await cache.get(`clip:${sample.id}`, z.string())
			} else {
				game.status = "finished"
				game.nextActionAt = new Date(now + 5 * 60 * 1000) // 5 minutes
				game.currentSample = null
				game.currentTrack = null
			}
		} else if (game.status === "finished") {
			await cache.del(`game:${id}`)
		}

		await cache.set(`game:${id}`, game)
		broadcastGameUpdate(game)
	}
}
