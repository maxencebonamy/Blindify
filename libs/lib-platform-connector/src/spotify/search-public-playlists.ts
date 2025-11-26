import { convertPlaylist } from "#/spotify/convert"
import { PlatformConnectorError } from "#/error"
import { search } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"
import { logger } from "lib-logger"
import { paginate } from "lib-pagination"
import { errors } from "lib-utils"

export const searchPublicPlaylists: PlatformConnector["searchPublicPlaylists"] = async (accessToken, query, page, limit) => {
	if (query === "") {
		throw new PlatformConnectorError("Cannot search public playlsts with empty query string")
	}

	const playlists = await search({
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
