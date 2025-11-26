import { convertPlaylist } from "#/spotify/convert"
import { PlatformConnectorError } from "#/error"
import type { PagingPlaylistObject } from "#/spotify/generated"
import { getAListOfCurrentUsersPlaylists, search } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"
import { logger } from "lib-logger"
import { paginate } from "lib-pagination"
import { errors } from "lib-utils"

export const searchPlaylists: PlatformConnector["searchPlaylists"] = async (accessToken, page, limit, query) => {
	let playlists: PagingPlaylistObject

	if (!query) {
		playlists = await getAListOfCurrentUsersPlaylists({
			headers: { authorization: `Bearer ${accessToken}` },
			query: {
				offset: (page - 1) * limit,
				limit
			}
		}).then(result => {
			if (result.error) {
				throw new PlatformConnectorError(`Failed to get user playlists: ${result.error.error.message}`)
			}
			return result.data
		})
	} else {
		playlists = await search({
			headers: { authorization: `Bearer ${accessToken}` },
			query: {
				q: query,
				offset: (page - 1) * limit,
				limit,
				type: [ "playlist" ]
			}
		}).then(result => {
			if (result.error) {
				throw new PlatformConnectorError(`Failed to search public playlists: ${result.error.error.message}`)
			}
			if (!result.data.playlists) {
				throw new PlatformConnectorError("Failed to search public playlists")
			}
			return result.data.playlists
		})
	}

	return paginate.fromSubset(playlists.items?.map(item => {
		if (!item) return null
		try {
			return convertPlaylist(item)
		} catch (error) {
			logger.warn(`Failed to convert playlist: ${errors.from(error).message}`)
			return null
		}
	}) ?? [], { currentPage: page, pageSize: limit, totalItems: playlists.total, fillWith: null })
}
