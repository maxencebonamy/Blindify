import { env } from "#/env"
import { convertToken } from "#/spotify/convert"
import type { PlatformConnector } from "#/types"

export const oAuthTokenExchange: PlatformConnector["oAuthTokenExchange"] = async (redirectUri, code) => {
	const token = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Authorization": "Basic " + Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri
		})
	})
	if (!token.ok) {
		throw new Error("Token exchange failed")
	}

	return convertToken(await token.json())
}
