import type { CatalogAlbum, CatalogArtist, CatalogTrack } from "#/types"
import { arrays } from "lib-utils"
import z from "zod"

export const zDeezerArtist = z.object({
	type: z.literal("artist"),
	id: z.int(),
	name: z.string(),
	picture_xl: z.url().nullish()
}).transform(e => ({
	id: e.id,
	name: e.name,
	avatar: e.picture_xl ?? null
} satisfies CatalogArtist))
export type DeezerArtist = z.infer<typeof zDeezerArtist>

export const zDeezerAlbum = z.object({
	type: z.literal("album"),
	id: z.int(),
	title: z.string(),
	cover_xl: z.url().nullish()
}).transform(e => ({
	id: e.id,
	name: e.title,
	cover: e.cover_xl ?? null
} satisfies CatalogAlbum))
export type DeezerAlbum = z.infer<typeof zDeezerAlbum>

export const zDeezerTrack = z.object({
	type: z.literal("track"),
	id: z.int(),
	title: z.string(),
	artist: zDeezerArtist,
	contributors: z.array(z.object({ type: z.string() }).loose()),
	album: zDeezerAlbum,
	preview: z.url().nullish()
}).transform(e => ({
	id: e.id,
	title: e.title,
	artists: arrays.dedupeBy([ ...e.contributors.filter(c => c.type === "artist").map(c => zDeezerArtist.parse(c)), e.artist ], "id"),
	album: e.album,
	preview: e.preview ?? null
} satisfies CatalogTrack))
export type DeezerTrack = z.infer<typeof zDeezerTrack>
