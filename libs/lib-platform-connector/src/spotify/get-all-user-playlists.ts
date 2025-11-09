import { convertPlaylist } from "#/spotify/convert"
import { getAListOfCurrentUsersPlaylists } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"

export const getAllUserPlaylists: PlatformConnector["getAllUserPlaylists"] = async accessToken => {
	const playlistCount = await getAListOfCurrentUsersPlaylists({
		query: { limit: 1 },
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch total user playlists: ${result.error.error.message}`)
		}
		return result.data.total
	})

	const limit = 50
	const totalPages = Math.ceil(playlistCount / limit)

	const allPlaylists = await Promise.all(Array.from({ length: totalPages }).map(async (_, i) => {
		const offset = limit * i

		const playlists = await getAListOfCurrentUsersPlaylists({
			query: { limit, offset },
			headers: { authorization: `Bearer ${accessToken}` }
		}).then(result => {
			if (result.error) {
				throw new Error(`Failed to fetch user playlists: ${result.error.error.message}`)
			}
			return result.data
		})

		return playlists.items?.map(item => {
			try {
				return convertPlaylist(item)
			} catch {
				return null
			}
		}).filter(playlist => playlist !== null) ?? []
	})).then(e => e.flat().sort((a, b) => a.name.localeCompare(b.name)))

	return allPlaylists
}
