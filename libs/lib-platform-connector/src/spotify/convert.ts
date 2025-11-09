import type { PlaylistObject, PlaylistTrackObject, SimplifiedPlaylistObject } from "#/spotify/generated"
import type { PlatformPlaylist, PlatformToken, PlatformTrack } from "#/types"
import z from "zod"

export const convertToken = (token: unknown): PlatformToken => z
	.object({
		access_token: z.string(),
		refresh_token: z.string().optional(),
		expires_in: z.number()
	})
	.transform(e => ({
		accessToken: e.access_token,
		refreshToken: e.refresh_token ?? null,
		expiresIn: e.expires_in
	} satisfies PlatformToken))
	.parse(token)

export const convertPlaylistTrack = (playlistTrack: PlaylistTrackObject): PlatformTrack => z
	.object({
		track: z.object({
			type: z.literal("track"),
			id: z.string(),
			name: z.string(),
			artists: z.array(z.object({
				id: z.string(),
				name: z.string()
			})).min(1),
			album: z.object({
				id: z.string(),
				name: z.string(),
				images: z.array(z.object({ url: z.url().optional() })).optional()
			}),
			preview_url: z.url().nullable()
		})
	})
	.transform(e => ({
		id: e.track.id,
		title: e.track.name,
		artists: e.track.artists.map(artist => ({
			id: artist.id,
			name: artist.name
		})),
		album: {
			id: e.track.album.id,
			name: e.track.album.name,
			cover: e.track.album.images?.[0]?.url ?? null
		},
		clip: e.track.preview_url
	} satisfies PlatformTrack))
	.parse(playlistTrack)

export const convertPlaylist = (playlist: SimplifiedPlaylistObject | PlaylistObject): PlatformPlaylist => z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullish().transform(e => e ?? null),
		images: z.array(z.object({ url: z.url().optional() })).optional(),
		tracks: z.object({ total: z.number().optional() }).optional()
	})
	.transform(e => ({
		id: e.id,
		name: e.name,
		description: e.description,
		cover: e.images?.[0]?.url ?? null,
		trackCount: e.tracks?.total ?? 0
	} satisfies PlatformPlaylist))
	.parse(playlist)
