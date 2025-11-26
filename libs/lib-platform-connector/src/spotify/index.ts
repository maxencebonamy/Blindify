import { getAllTracksFromPlaylist } from "#/spotify/get-all-tracks-from-playlist"
import { getCurrentUser } from "#/spotify/get-current-user"
import { getPlaylist } from "#/spotify/get-playlist"
import { oAuthAuthorizeUrl } from "#/spotify/oauth-authorize-url"
import { oAuthTokenExchange } from "#/spotify/oauth-token-exchange"
import { oAuthTokenRefresh } from "#/spotify/oauth-token-refresh"
import { searchPlaylists } from "#/spotify/search-playlists"
import type { PlatformConnector } from "#/types"

export const spotifyConnector = {
	// Auth
	oAuthAuthorizeUrl,
	oAuthTokenExchange,
	oAuthTokenRefresh,

	// Users
	getCurrentUser,

	// Playlists
	searchPlaylists,
	getPlaylist,
	getAllTracksFromPlaylist
} satisfies PlatformConnector
