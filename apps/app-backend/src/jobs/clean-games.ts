import { getAllGames } from "#/services/game"
import { zGame } from "#/types/game.type"
import type { AutoLoaderTask } from "lib-auto-loader"
import { cache } from "lib-cache"

export const cron = "0 * * * * *"

export const task: AutoLoaderTask = async () => {
	const activeGames = await getAllGames()
	const finishedGameIds: string[] = []

	for (const { id } of activeGames) {
		const game = await cache.get(`game:${id}`, zGame).catch(() => null)

		if (game === null) {
			finishedGameIds.push(id)
		} else if (game.status === "finished" && game.nextActionAt && game.nextActionAt.getTime() > Date.now()) {
			finishedGameIds.push(id)
		}
	}

	await cache.set("games", activeGames.filter(e => !finishedGameIds.includes(e.id)))
}
