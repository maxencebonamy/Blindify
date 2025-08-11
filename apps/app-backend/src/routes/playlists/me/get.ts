import { getCurrentUsersProfile, getListUsersPlaylists } from "#/generated"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"
import z from "zod"

export const method: HTTPMethods = "GET"

export const url = "/playlists/me"

export const schema = {
	operationId: "playlistsMe",
	description: "Get current user's playlists",
	tags: [ "playlists" ],
	response: {
		200: z.array(z.object({
			id: z.string(),
			name: z.string()
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
	logger.debug(`${method} ${url}`)

	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ error: "Access token missing" })
	}

	const user = await getCurrentUsersProfile({ headers: { authorization: `Bearer ${accessToken}` } })
	if (user.error) {
		return reply.code(401).send({ error: user.error.error.message })
	}

	const playlists = await getListUsersPlaylists({ path: { user_id: user.data.id ?? "" }, headers: { authorization: `Bearer ${accessToken}` } })
	if (playlists.error) {
		return reply.code(401).send({ error: playlists.error.error.message })
	}

	return reply.send(playlists.data.items?.map(playlist => ({
		id: playlist.id ?? "",
		name: playlist.name ?? ""
	})) ?? [])
}
