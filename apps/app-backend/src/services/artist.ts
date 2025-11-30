import { cache } from "lib-cache"
import type { CatalogArtist } from "lib-catalog"
import { catalog, zCatalogArtist } from "lib-catalog"

export const getArtistById = async (artistId: number): Promise<CatalogArtist> => {
	const cacheKey = `artists:${artistId}`

	try {
		return await cache.get(cacheKey, zCatalogArtist)
	} catch {
		// Not found, continue
	}

	const artist = await catalog.getArtist(artistId)
	await cache.set(cacheKey, artist)
	return artist
}
