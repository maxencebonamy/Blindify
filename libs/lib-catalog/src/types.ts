import z from "zod"

export const zCatalogArtist = z.object({
	id: z.int(),
	name: z.string(),
	avatar: z.url().nullable()
})
export type CatalogArtist = z.infer<typeof zCatalogArtist>

export const zCatalogAlbum = z.object({
	id: z.int(),
	name: z.string(),
	cover: z.url().nullable()
})
export type CatalogAlbum = z.infer<typeof zCatalogAlbum>

export const zCatalogTrack = z.object({
	id: z.int(),
	title: z.string(),
	artists: z.array(zCatalogArtist).min(0),
	album: zCatalogAlbum,
	preview: z.url().nullable()
})
export type CatalogTrack = z.infer<typeof zCatalogTrack>
