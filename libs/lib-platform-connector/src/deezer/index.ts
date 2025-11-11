import { getAllTracksFromPlaylist } from "#/deezer/get-all-tracks-from-playlist"
import { getAllUserPlaylists } from "#/deezer/get-all-user-playlists"
import { getCurrentUser } from "#/deezer/get-current-user"
import { getPlaylist } from "#/deezer/get-playlist"
import { oAuthAuthorizeUrl } from "#/deezer/oauth-authorize-url"
import { oAuthTokenExchange } from "#/deezer/oauth-token-exchange"
import { oAuthTokenRefresh } from "#/deezer/oauth-token-refresh"
import type { PlatformConnector } from "#/types"

export const deezerConnector = {
	oAuthAuthorizeUrl,
	oAuthTokenExchange,
	oAuthTokenRefresh,
	getCurrentUser,
	getAllUserPlaylists,
	getPlaylist: getPlaylist,
	getAllTracksFromPlaylist
} satisfies PlatformConnector
