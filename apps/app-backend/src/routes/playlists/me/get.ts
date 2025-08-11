import { getCurrentUsersProfile, getListUsersPlaylists } from "#/generated"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/playlists/me"

export const handler: Handler = async (request, reply) => {
	logger.debug(`${method} ${url}`)

	const accessToken = request.cookies["access_token"]

	if (!accessToken) {
		reply.code(401).send({ error: "Access token missing" })
		return
	}

	const user = await getCurrentUsersProfile({ headers: { authorization: `Bearer ${accessToken}` } })
	if (user.error) {
		reply.code(401).send({ error: user.error.error })
		return
	}

	const playlists = await getListUsersPlaylists({ path: { user_id: user.data.id ?? "" }, headers: { authorization: `Bearer ${accessToken}` } })
	if (playlists.error) {
		reply.code(401).send({ error: playlists.error.error })
		return
	}

	return reply.send(playlists.data.items?.map(playlist => ({
		id: playlist.id,
		name: playlist.name
	})))
}

export const schema: Schema = {
	operationId: "playlistsMe",
	description: "Get current user's playlists",
	tags: [ "playlists" ],
	response: {
		200: {
			description: "List of user playlists",
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					name: { type: "string" }
				}
			}
		},
		401: {
			description: "Unauthorized - Access token missing or invalid",
			type: "object",
			properties: {
				error: { type: "string" }
			}
		},
		500: {
			description: "Internal Server Error",
			type: "object",
			properties: {
				error: { type: "string" }
			}
		}
	}
}
