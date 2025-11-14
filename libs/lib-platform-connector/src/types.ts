import type { Page } from "lib-pagination"
import z from "zod"

export const zToken = z.object({
	accessToken: z.string(),
	refreshToken: z.string().nullable(),
	accessExpiresAt: z.date()
})
export type Token = z.infer<typeof zToken>

export const zUser = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	avatar: z.url().nullable()
})
export type User = z.infer<typeof zUser>

export const zArtist = z.object({
	id: z.string(),
	name: z.string()
})
export type Artist = z.infer<typeof zArtist>

export const zAlbum = z.object({
	id: z.string(),
	name: z.string(),
	cover: z.url().nullable()
})
export type Album = z.infer<typeof zAlbum>

export const zTrack = z.object({
	id: z.string(),
	title: z.string(),
	clip: z.url().nullable(),
	artists: z.array(zArtist),
	album: zAlbum
})
export type Track = z.infer<typeof zTrack>

export const zPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	cover: z.url().nullable(),
	trackCount: z.number()
})
export type Playlist = z.infer<typeof zPlaylist>

export const zPlatform = z.enum([ "spotify", "deezer" ])
export type Platform = z.infer<typeof zPlatform>

export type PlatformConnector = {
	oAuthAuthorizeUrl: (redirectUri: string, state: string) => string
	oAuthTokenExchange: (redirectUri: string, code: string) => Promise<Token>
	oAuthTokenRefresh: (refreshToken: string) => Promise<Token>

	getCurrentUser: (accessToken: string) => Promise<User>
	getAllUserPlaylists: (accessToken: string) => Promise<Playlist[]>

	searchPublicPlaylists: (accessToken: string, query: string, page: number, limit: number) => Promise<Page<Playlist>>

	getPlaylist: (accessToken: string, playlistId: string) => Promise<Playlist>
	getAllTracksFromPlaylist: (accessToken: string, playlistId: string) => Promise<Track[]>
}
