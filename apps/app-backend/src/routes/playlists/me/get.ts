import { getAListOfCurrentUsersPlaylists } from "#/generated"
import type { Handler, Schema } from "#/types/fastify"
import { paginateFromSpotify, zPage } from "#/types/page"
import z from "zod"

export const schema = {
	operationId: "indexUserPlaylists",
	description: "Get current user's playlists",
	tags: [ "playlists" ],
	querystring: z.object({
		page: z.coerce.number().int().min(1).optional().default(1),
		limit: z.coerce.number().int().min(1).max(50).optional().default(20),
		nameFilter: z.string().optional()
	}),
	response: {
		200: zPage(z.object({
			id: z.string(),
			name: z.string(),
			description: z.string().nullable(),
			cover: z.string().nullable(),
			totalTracks: z.number().int()
		})),
		401: z.object({
			error: z.string()
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

	const spotifyPlaylists = await getAListOfCurrentUsersPlaylists({
		query: {
			limit: request.query.limit,
			offset: (request.query.page - 1) * request.query.limit
		},
		headers: { authorization: `Bearer ${accessToken}` }
	})
	if (spotifyPlaylists.error) {
		return reply.code(500).send({ error: spotifyPlaylists.error.error.message })
	}

	const spotifyPlaylistsItems = spotifyPlaylists.data.items ?? []
	type Playlist = z.infer<typeof schema.response["200"]>["items"][number]
	const playlists = spotifyPlaylistsItems.map(e => ({
		id: e.id,
		name: e.name,
		description: e.description ?? null,
		cover: e.images?.[0]?.url ?? null,
		totalTracks: e.tracks?.total
	})).filter(
		(e): e is Playlist => e.id !== undefined && e.name !== undefined && e.totalTracks !== undefined && e.totalTracks > 0
	)

	return reply.send(paginateFromSpotify(spotifyPlaylists.data, playlists))
}
