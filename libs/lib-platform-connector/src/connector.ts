import { deezerConnector } from "#/deezer"
import { spotifyConnector } from "#/spotify"
import type { Platform, PlatformConnector } from "#/types"

export const connector = (platform: Platform): PlatformConnector => {
	switch (platform) {
		case "spotify":
			return spotifyConnector
		case "deezer":
			return deezerConnector
		default:
			throw new Error(`Unsupported platform: ${platform}`)
	}
}
