import { convertPlaylist } from "#/deezer/convert"
import { search } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"
import { paginate } from "lib-pagination"

export const searchPublicPlaylists: PlatformConnector["searchPublicPlaylists"] = async (query, page, limit) => {
	const playlists = await search({
		query: {
			q: query,
			offset: (page - 1) * limit,
			limit,
			type: [ "playlist" ]
		}
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch public playlists: ${result.error.error.message}`)
		}
		if (!result.data.playlists) {
			throw new Error("Failed to fetch public playlists")
		}
		return result.data.playlists
	})

	return paginate.fromSubset(playlists.items?.map(item => {
		try {
			return convertPlaylist(item)
		} catch {
			return null
		}
	}).filter(playlist => playlist !== null) ?? [], { currentPage: page, pageSize: limit, totalItems: playlists.total })
}
