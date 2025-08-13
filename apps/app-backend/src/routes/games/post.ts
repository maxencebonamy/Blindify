import type { TrackObject } from "#/generated"
import { getPlaylist } from "#/generated"
import { getSample } from "#/services/sample"
import type { Handler, Schema } from "#/types/fastify"
import type { Game } from "#/types/game.type"
import { zGame } from "#/types/game.type"
import { generateUUID } from "#/utils/random"
import { cache } from "lib-cache"
import z from "zod"

export const schema = {
	operationId: "createGame",
	description: "Create a new game",
	tags: [ "games" ],
	body: zGame.pick({
		playlistId: true,
		nbRounds: true,
		samplesDuration: true
	}),
	response: {
		200: z.object({
			id: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies Schema

export const handler: Handler<typeof schema> = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ error: "Access token missing" })
	}

	const gameId = generateUUID()

	const playlist = await getPlaylist({
		path: { playlist_id: request.body.playlistId },
		query: { market: "IT" },
		headers: { authorization: `Bearer ${accessToken}` }
	})
	if (playlist.error) {
		return reply.code(500).send({ error: playlist.error.error.message })
	}

	const items = playlist.data.tracks?.items ?? []
	if (items.length === 0) {
		return reply.code(500).send({ error: "Playlist not found or empty" })
	}

	const tracks = items.map(item => item.track as unknown as TrackObject)
	const samples = await Promise.all(tracks.map(track => getSample(track.name ?? "", track.artists ?? [])))

	const itemsWithSample = items.filter(item => item.preview)

	await cache.set(`game:${gameId}`, {
		playlistId: request.body.playlistId,
		nbRounds: request.body.nbRounds,
		samplesDuration: request.body.samplesDuration,
		trackIds: items.map(item => item.id ?? "")
	} satisfies Game)

	return reply.send({ id: gameId })
}
