import type { SearchTrack } from "#/search/common"
import z from "zod"

export const zAppleTrack = z.object({
	trackId: z.number(),
	trackName: z.string(),
	artistName: z.string(),
	collectionName: z.string(),
	previewUrl: z.url()
}).transform(e => ({
	id: e.trackId.toString(),
	title: e.trackName,
	artist: e.artistName,
	album: e.collectionName,
	clip: e.previewUrl
} satisfies SearchTrack))
export type AppleTrack = z.infer<typeof zAppleTrack>

export const zAppleSearchResponse = z.object({
	results: z.array(zAppleTrack)
}).transform(e => e.results satisfies SearchTrack[])
export type AppleSearchResponse = z.infer<typeof zAppleSearchResponse>
