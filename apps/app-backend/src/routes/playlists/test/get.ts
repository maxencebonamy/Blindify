import type { TrackObject } from "#/generated"
import { getCurrentUsersProfile, getPlaylist } from "#/generated"
import type { Handler, Schema } from "#/types/fastify"
import type { HTTPMethods } from "fastify"
import { logger } from "lib-logger"

export const method: HTTPMethods = "GET"

export const url = "/playlists/test"

const getSampleUrl = async (title: string, artist: string): Promise<string | null> => {
	const searchUrl = `https://api.deezer.com/search/track?q=${encodeURIComponent(title)}%20${encodeURIComponent(artist)}`
	const tracks = await fetch(searchUrl)
	if (!tracks.ok) {
		throw new Error(`Failed to fetch tracks: ${tracks.statusText}`)
	}
	const data = await tracks.json()
	if (!data.data || data.data.length === 0) {
		return null
	}

	const track = data.data[0]
	if (!track.preview) {
		return null
	}

	return track.preview
}

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

	const fullPlaylist = await getPlaylist({
		path: { playlist_id: "7LXwbZz1HKqOnjiuxc7ZkX" },
		query: { market: "IT" },
		headers: { authorization: `Bearer ${accessToken}` }
	})
	if (fullPlaylist.error) {
		reply.code(500).send({ error: fullPlaylist.error.error })
		return
	}

	const content = await Promise.all(
		(fullPlaylist.data.tracks?.items?.slice(0, 20) ?? []).map(async track => {
			const trackObject = track.track as unknown as TrackObject
			const title = trackObject.name ?? ""
			const artist = trackObject.artists?.[0]?.name ?? ""
			const sampleUrl = await getSampleUrl(title, artist)
			return {
				id: trackObject.id,
				name: trackObject.name,
				sample: sampleUrl
			}
		})
	)

	return reply.send(content)
}

export const schema: Schema = {
	operationId: "playlistsTest",
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
					name: { type: "string" },
					sample: { type: "string", nullable: true }
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
