import type { SearchTrack } from "#/search/common"
import z from "zod"

export const zDeezerArtist = z.object({
	name: z.string()
})
export type DeezerArtist = z.infer<typeof zDeezerArtist>

export const zDeezerAlbum = z.object({
	title: z.string()
})
export type DeezerAlbum = z.infer<typeof zDeezerAlbum>

export const zDeezerTrack = z.object({
	id: z.number(),
	title: z.string(),
	artist: zDeezerArtist,
	album: zDeezerAlbum,
	preview: z.url()
}).transform(e => ({
	id: e.id.toString(),
	title: e.title,
	artist: e.artist.name,
	album: e.album.title,
	clip: e.preview
} satisfies SearchTrack))
export type DeezerTrack = z.infer<typeof zDeezerTrack>

export const zDeezerSearchResponse = z.object({
	data: z.array(zDeezerTrack)
}).transform(e => e.data satisfies SearchTrack[])
export type DeezerSearchResponse = z.infer<typeof zDeezerSearchResponse>
