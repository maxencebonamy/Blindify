import { env } from "#/env"
import { convertToken } from "#/spotify/convert"
import type { PlatformConnector } from "#/types"

export const oAuthTokenRefresh: PlatformConnector["oAuthTokenRefresh"] = async refreshToken => {
	const token = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Authorization": "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: env.SPOTIFY_CLIENT_ID
		})
	})
	if (!token.ok) {
		throw new Error("Token refresh failed")
	}

	return convertToken(await token.json())
}
