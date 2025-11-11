import type { User as DeezerUser, Playlist as DeezerPlaylist } from "#/deezer/generated"
import type { Playlist, User } from "#/types"
import z from "zod"

export const convertUser = (user: DeezerUser): User => z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.email(),
		picture_xl: z.url().optional()
	})
	.transform(e => ({
		id: e.id,
		name: e.name,
		email: e.email,
		avatar: e.picture_xl ?? null
	} satisfies User))
	.parse(user)

export const convertPlaylist = (playlist: DeezerPlaylist): Playlist => z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		picture_xl: z.url().optional(),
		nb_tracks: z.int().optional()
	})
	.transform(e => ({
		id: e.id,
		name: e.name,
		description: e.description ?? null,
		cover: e.picture_xl ?? null,
		trackCount: e.nb_tracks ?? 0
	} satisfies Playlist))
	.parse(playlist)
