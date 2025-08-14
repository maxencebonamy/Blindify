import { cache } from "lib-cache"
import z from "zod"

export const getSample = async (title: string, artist: string): Promise<string | null> => {
	const cacheKey = `sample:${title}-${artist}`

	try {
		const sample = await cache.get(cacheKey, z.string().nullable())
		return sample
	} catch {
		// Not found in cache, proceed to fetch
	}

	const searchUrl = `https://api.deezer.com/search/track?q=${encodeURIComponent(title)}%20${encodeURIComponent(artist)}`
	const tracks = await fetch(searchUrl).then(result => {
		if (!result.ok) {
			throw new Error(`Failed to fetch tracks: ${result.statusText}`)
		}
		return result.json()
	})
	if (!tracks || tracks.length === 0) {
		await cache.set(cacheKey, null)
		return null
	}

	const track = tracks[0]
	if (!track.preview) {
		await cache.set(cacheKey, null)
		return null
	}

	await cache.set(cacheKey, track.preview)
	return track.preview
}
