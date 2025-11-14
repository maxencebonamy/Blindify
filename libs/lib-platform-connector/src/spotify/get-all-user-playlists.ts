import { convertPlaylist } from "#/spotify/convert"
import { getAListOfCurrentUsersPlaylists } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"
import { logger } from "lib-logger"
import { errors } from "lib-utils"

export const getAllUserPlaylists: PlatformConnector["getAllUserPlaylists"] = async accessToken => {
	const playlistCount = await getAListOfCurrentUsersPlaylists({
		headers: { authorization: `Bearer ${accessToken}` },
		query: { limit: 1 }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to get total user playlists: ${result.error.error.message}`)
		}
		return result.data.total
	})

	const limit = 50
	const totalPages = Math.ceil(playlistCount / limit)

	const allPlaylists = await Promise.all(Array.from({ length: totalPages }).map(async (_, i) => {
		const offset = limit * i

		const playlists = await getAListOfCurrentUsersPlaylists({
			headers: { authorization: `Bearer ${accessToken}` },
			query: { limit, offset }
		}).then(result => {
			if (result.error) {
				throw new Error(`Failed to fetch user playlists: ${result.error.error.message}`)
			}
			return result.data
		})

		return playlists.items?.map(item => {
			try {
				return convertPlaylist(item)
			} catch (error) {
				logger.warn(`Failed to convert playlist: ${errors.from(error).message} (${JSON.stringify(item)})`)
				return null
			}
		}).filter(playlist => playlist !== null) ?? []
	})).then(e => e.flat().sort((a, b) => a.name.localeCompare(b.name)))

	return allPlaylists
}
