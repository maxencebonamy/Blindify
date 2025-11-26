import { getCurrentUser } from "#/deezer/get-current-user"
import { getPlaylist } from "#/deezer/get-playlist"
import type { PlatformConnector } from "#/types"

const notImplemented = (): never => {
	throw new Error("Not implemented")
}

export const deezerConnector = {
	// Auth
	oAuthAuthorizeUrl: notImplemented,
	oAuthTokenExchange: notImplemented,
	oAuthTokenRefresh: notImplemented,

	// Users
	getCurrentUser,

	// Playlists
	searchPlaylists: notImplemented,
	getPlaylist,
	getAllTracksFromPlaylist: notImplemented
} satisfies PlatformConnector
