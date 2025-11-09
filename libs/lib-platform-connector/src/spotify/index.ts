import { getAllTracksFromPlaylist } from "#/spotify/get-all-tracks-from-playlist"
import { getAllUserPlaylists } from "#/spotify/get-all-user-playlists"
import { getPlaylist } from "#/spotify/get-playlist"
import { oAuthAuthorizeUrl } from "#/spotify/oauth-authorize-url"
import { oAuthTokenExchange } from "#/spotify/oauth-token-exchange"
import type { PlatformConnector } from "#/types"

export const spotifyConnector = {
	oAuthAuthorizeUrl,
	oAuthTokenExchange,
	getAllUserPlaylists,
	getPlaylist: getPlaylist,
	getAllTracksFromPlaylist
} satisfies PlatformConnector
