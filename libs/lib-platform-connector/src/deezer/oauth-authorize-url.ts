import { env } from "#/env"
import type { PlatformConnector } from "#/types"
import { http } from "lib-utils"

export const oAuthAuthorizeUrl: PlatformConnector["oAuthAuthorizeUrl"] = (redirectUri, state) => {
	return http.buildUrl("https://connect.deezer.com/oauth/auth.php", {
		app_id: env.DEEZER_CLIENT_ID,
		redirect_uri: `${redirectUri}?state=${state}`,
		perms: "basic_access,email"
	})
}
