import { env } from "#/env"
import { PlatformConnectorError } from "#/error"
import { convertToken } from "#/spotify/convert"
import type { PlatformConnector } from "#/types"
import { errors } from "lib-utils"

export const oAuthTokenExchange: PlatformConnector["oAuthTokenExchange"] = async (redirectUri, code) => {
	const response = await fetch("https://accounts.spotify.com/api/token", {
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
	if (!response.ok) {
		throw new PlatformConnectorError("Token exchange failed")
	}

	const token = await response.json()

	try {
		return convertToken(token)
	} catch (error) {
		throw new PlatformConnectorError(`Failed to convert token: ${errors.from(error).message} (${JSON.stringify(token)})`)
	}
}
