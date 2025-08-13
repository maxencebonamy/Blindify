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
	const tracks = await fetch(searchUrl)
	if (!tracks.ok) {
		throw new Error(`Failed to fetch tracks: ${tracks.statusText}`)
	}
	const data = await tracks.json()
	if (!data.data || data.data.length === 0) {
		await cache.set(cacheKey, null)
		return null
	}

	const track = data.data[0]
	if (!track.preview) {
		await cache.set(cacheKey, null)
		return null
	}

	await cache.set(cacheKey, track.preview)
	return track.preview
}
