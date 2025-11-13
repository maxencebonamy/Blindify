import { getAllUserPlaylists } from "#/deezer/get-all-user-playlists"
import { getCurrentUser } from "#/deezer/get-current-user"
import { getPlaylist } from "#/deezer/get-playlist"
import type { PlatformConnector } from "#/types"

const notImplemented = (): never => {
	throw new Error("Not implemented")
}

export const deezerConnector = {
	oAuthAuthorizeUrl: notImplemented,
	oAuthTokenExchange: notImplemented,
	oAuthTokenRefresh: notImplemented,
	getCurrentUser,
	getAllUserPlaylists,
	searchPublicPlaylists: notImplemented,
	getPlaylist,
	getAllTracksFromPlaylist: notImplemented
} satisfies PlatformConnector
