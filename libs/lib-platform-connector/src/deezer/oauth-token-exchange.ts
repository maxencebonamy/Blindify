import { env } from "#/env"
import { convertToken } from "#/spotify/convert"
import type { PlatformConnector } from "#/types"
import { logger } from "lib-logger"

export const oAuthTokenExchange: PlatformConnector["oAuthTokenExchange"] = async (_, code) => {
	const token = await fetch("https://connect.deezer.com/oauth/access_token.php", {
		body: new URLSearchParams({
			app_id: env.DEEZER_CLIENT_ID,
			secret: env.DEEZER_CLIENT_SECRET,
			code
		})
	})
	if (!token.ok) {
		throw new Error("Token exchange failed")
	}
	const response = await token.json()
	logger.debug(response)
	return response

	return convertToken(await token.json())
}
