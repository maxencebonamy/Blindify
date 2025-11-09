import { env } from "#/env"
import type { PlatformConnector } from "#/types"
import { http } from "lib-utils"

export const oAuthAuthorizeUrl: PlatformConnector["oAuthAuthorizeUrl"] = (redirectUri, state) => {
	return http.buildUrl("https://accounts.spotify.com/authorize", {
		client_id: env.SPOTIFY_CLIENT_ID,
		response_type: "code",
		redirect_uri: redirectUri,
		state,
		scope: "user-read-private user-read-email playlist-read-private"
	})
}
