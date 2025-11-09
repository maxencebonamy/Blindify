import z from "zod"

export const zPlatformArtist = z.object({
	id: z.string(),
	name: z.string()
})
export type PlatformArtist = z.infer<typeof zPlatformArtist>

export const zPlatformAlbum = z.object({
	id: z.string(),
	name: z.string(),
	cover: z.url().nullable()
})
export type PlatformAlbum = z.infer<typeof zPlatformAlbum>

export const zPlatformTrack = z.object({
	id: z.string(),
	title: z.string(),
	clip: z.url().nullable(),
	artists: z.array(zPlatformArtist),
	album: zPlatformAlbum
})
export type PlatformTrack = z.infer<typeof zPlatformTrack>

export const zPlatformPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	cover: z.url().nullable(),
	trackCount: z.number()
})
export type PlatformPlaylist = z.infer<typeof zPlatformPlaylist>

export const zPlatformToken = z.object({
	accessToken: z.string(),
	refreshToken: z.string().nullable(),
	expiresIn: z.number()
})
export type PlatformToken = z.infer<typeof zPlatformToken>

export type PlatformConnector = {
	oAuthAuthorizeUrl: (redirectUri: string, state: string) => string
	oAuthTokenExchange: (redirectUri: string, code: string) => Promise<PlatformToken>
	getAllUserPlaylists: (accessToken: string) => Promise<PlatformPlaylist[]>
	getPlaylist: (accessToken: string, playlistId: string) => Promise<PlatformPlaylist>
	getAllTracksFromPlaylist: (accessToken: string, playlistId: string) => Promise<PlatformTrack[]>
}
