import { getAllGames } from "#/services/game"
import type { AutoLoaderTask } from "lib-auto-loader"
import { cache } from "lib-cache"

export const cron = "0 * * * * *"

export const task: AutoLoaderTask = async () => {
	const activeGames = await getAllGames()
	const finishedGameIds: string[] = []

	for (const { id } of activeGames) {
		const exists = await cache.has(`game:${id}`)
		if (!exists) finishedGameIds.push(id)
	}

	await cache.set("games", activeGames.filter(e => !finishedGameIds.includes(e.id)))
}
