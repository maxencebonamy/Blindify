import type { TrackObject } from "#/generated"
import { getCurrentUsersProfile, getPlaylist } from "#/generated"
import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import z from "zod"

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

export const schema = {
	operationId: "playlistsTest",
	description: "Test",
	tags: [ "playlists" ],
	response: {
		200: z.array(
			z.object({
				id: z.string(),
				name: z.string(),
				sample: z.string().nullable()
			})
		),
		401: z.object({
			error: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler = async (request, reply) => {
	const accessToken = request.cookies["access_token"]
	if (!accessToken) {
		return reply.code(401).send({ error: "Access token missing" })
	}

	const user = await getCurrentUsersProfile({ headers: { authorization: `Bearer ${accessToken}` } })
	if (user.error) {
		return reply.code(401).send({ error: user.error.error })
	}

	const fullPlaylist = await getPlaylist({
		path: { playlist_id: "7LXwbZz1HKqOnjiuxc7ZkX" },
		query: { market: "IT" },
		headers: { authorization: `Bearer ${accessToken}` }
	})
	if (fullPlaylist.error) {
		return reply.code(500).send({ error: fullPlaylist.error.error })
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
