import type { Track } from "#/types/track.type"
import { cache } from "lib-cache"
import z from "zod"

export const getClip = async (track: Track): Promise<string | null> => {
	const title = track.title
	const artist = track.artists.join(", ")

	const cacheKey = `clip:${title}:${artist}`

	try {
		const clip = await cache.get(cacheKey, z.string().nullable())
		return clip
	} catch {
		// Not found, continue
	}

	// TODO: Les princes de MZ et Nekfeu + Course Poursuite de Lefa : pas le bon extrait
	// TODO: Too Many Nights pas trouvé à cause du "with" dans le titre

	const searchUrl = `https://api.deezer.com/search/track?q=${encodeURIComponent(title)}%20${encodeURIComponent(artist)}`
	const spotifyTracks = await fetch(searchUrl).then(result => {
		if (!result.ok) {
			throw new Error(`Failed to fetch tracks: ${result.statusText}`)
		}
		return result.json()
	})
	if (!spotifyTracks?.data || spotifyTracks.data.length === 0) {
		await cache.set(cacheKey, null)
		return null
	}
	// logger.debug(tracks)

	const spotifyTrack = spotifyTracks.data[0]
	if (!spotifyTrack.preview) {
		await cache.set(cacheKey, null)
		return null
	}

	await cache.set(cacheKey, spotifyTrack.preview)
	return spotifyTrack.preview
}
