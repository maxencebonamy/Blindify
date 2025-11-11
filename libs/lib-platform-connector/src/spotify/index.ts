import { getAllTracksFromPlaylist } from "#/spotify/get-all-tracks-from-playlist"
import { getAllUserPlaylists } from "#/spotify/get-all-user-playlists"
import { getCurrentUser } from "#/spotify/get-current-user"
import { getPlaylist } from "#/spotify/get-playlist"
import { oAuthAuthorizeUrl } from "#/spotify/oauth-authorize-url"
import { oAuthTokenExchange } from "#/spotify/oauth-token-exchange"
import { oAuthTokenRefresh } from "#/spotify/oauth-token-refresh"
import type { PlatformConnector } from "#/types"

export const spotifyConnector = {
	oAuthAuthorizeUrl,
	oAuthTokenExchange,
	oAuthTokenRefresh,
	getCurrentUser,
	getAllUserPlaylists,
	getPlaylist: getPlaylist,
	getAllTracksFromPlaylist
} satisfies PlatformConnector
