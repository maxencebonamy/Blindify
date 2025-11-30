import { BASE_URL } from "#/deezer/common"
import { zDeezerTrack } from "#/deezer/types"
import { CatalogError } from "#/errors"
import type { CatalogTrack } from "#/types"
import { paginate, type Page } from "lib-pagination"
import { errors, http } from "lib-utils"
import z from "zod"

const zDeezerResponse = z.object({
	data: z.array(zDeezerTrack),
	total: z.int().min(0),
	prev: z.url().optional(),
	next: z.url().optional()
})
type DeezerResponse = z.infer<typeof zDeezerResponse>

export const getArtistTracks = async (artistId: number, page: number, limit: number): Promise<Page<CatalogTrack>> => {
	if (!artistId) {
		throw new CatalogError("Parameter artistId is empty")
	}

	const index = limit * (page - 1)
	const url = http.buildUrl(`${BASE_URL}/artist/${artistId}/top`, {
		index: index.toString(),
		limit: limit.toString()
	})

	let response: Response
	try {
		response = await fetch(url)
	} catch (error) {
		throw new CatalogError(`Failed to get artist ${artistId} tracks: ${errors.from(error).message}`)
	}

	if (!response.ok) {
		let body: unknown
		try {
			body = await response.clone().json()
		} catch {
			body = await response.text()
		}
		throw new CatalogError(`Bad response when getting artist ${artistId} tracks: ${response.status} - ${JSON.stringify(body)}`)
	}

	const body = await response.json()
	let parsedBody: DeezerResponse
	try {
		parsedBody = zDeezerResponse.parse(body)
	} catch (error) {
		throw new CatalogError(`Failed to parse response whem getting artist ${artistId} tracks: ${errors.from(error).message}`)
	}

	return paginate.fromSubset(parsedBody.data, { currentPage: page, pageSize: limit, totalItems: parsedBody.total })
}
