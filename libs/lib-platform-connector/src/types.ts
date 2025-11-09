import z from "zod"

export const zToken = z.object({
	accessToken: z.string(),
	refreshToken: z.string().nullable(),
	expiresIn: z.number()
})
export type Token = z.infer<typeof zToken>

export const zArtist = z.object({
	id: z.string(),
	name: z.string()
})
export type Artist = z.infer<typeof zArtist>
z.globalRegistry.add(zArtist, { id: "Artist" })

export const zAlbum = z.object({
	id: z.string(),
	name: z.string(),
	cover: z.url().nullable()
})
export type Album = z.infer<typeof zAlbum>
z.globalRegistry.add(zAlbum, { id: "Album" })

export const zTrack = z.object({
	id: z.string(),
	title: z.string(),
	clip: z.url().nullable(),
	artists: z.array(zArtist),
	album: zAlbum
})
export type Track = z.infer<typeof zTrack>
z.globalRegistry.add(zTrack, { id: "Track" })

export const zPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	cover: z.url().nullable(),
	trackCount: z.number()
})
export type Playlist = z.infer<typeof zPlaylist>
z.globalRegistry.add(zPlaylist, { id: "Playlist" })

export type PlatformConnector = {
	oAuthAuthorizeUrl: (redirectUri: string, state: string) => string
	oAuthTokenExchange: (redirectUri: string, code: string) => Promise<Token>
	getAllUserPlaylists: (accessToken: string) => Promise<Playlist[]>
	getPlaylist: (accessToken: string, playlistId: string) => Promise<Playlist>
	getAllTracksFromPlaylist: (accessToken: string, playlistId: string) => Promise<Track[]>
}
