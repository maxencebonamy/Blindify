export const getTrack = async (trackId: string): Promise<Track | null> => {
	try {
		const track = await cache.get(`track:${trackId}`, zTrack)
		return track
	} catch {
		// Not found in cache
	}

	const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}`
	const response = await fetch(trackUrl, {
		headers: { Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}` }
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch track: ${response.statusText}`)
	}

	const data = await response.json()
	if (!data.name || !data.artists || data.preview_url === null) {
		return null
	}

	const title = data.name
	const artist = data.artists.map((a: { name: string }) => a.name).join(", ")
	const sample = data.preview_url

	const track: Track = {
		title,
		artist,
		sample
	}

	await cache.set(`track:${trackId}`, track)
	return track
}