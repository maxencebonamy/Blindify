import { describe, it, expect, beforeAll } from "vitest"
import spotifyTracks from "./spotify.json"
import matches from "./matches.json"
import { findTrack } from "#/find/find"

const batchSize = 50

for (let i = 0; i < matches.length; i += batchSize) {
	const batch = matches.slice(i, i + batchSize)

	describe(`Find clip batch ${i / batchSize}`, () => {
		if (i > 0) {
			beforeAll(async () => {
				await new Promise(resolve => setTimeout(resolve, 5000))
			})
		}

		for (const match of batch) {
			const spotifyTrack = spotifyTracks.find(e => e.id === match.spotifyId)

			const params = {
				title: spotifyTrack?.title ?? "",
				album: spotifyTrack?.album.name ?? "",
				artist: spotifyTrack?.artists.map(e => e.name).join(", ") ?? ""
			}

			it(JSON.stringify(params), async () => {
				const foundTrack = await findTrack(params)

				expect(foundTrack).not.toBeNull()
				expect(foundTrack?.id).toBe(match.deezerId)
			})
		}
	})
}
