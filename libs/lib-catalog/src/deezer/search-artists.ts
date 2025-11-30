import { BASE_URL } from "#/deezer/common"
import { zDeezerArtist } from "#/deezer/types"
import { CatalogError } from "#/errors"
import type { CatalogArtist } from "#/types"
import { paginate, type Page } from "lib-pagination"
import { errors, http } from "lib-utils"
import z from "zod"

const zDeezerResponse = z.object({
	data: z.array(zDeezerArtist),
	total: z.int().min(0),
	prev: z.url().optional(),
	next: z.url().optional()
})
type DeezerResponse = z.infer<typeof zDeezerResponse>

export const searchArtists = async (query: string, page: number, limit: number): Promise<Page<CatalogArtist>> => {
	if (!query) {
		throw new CatalogError("Parameter query is empty")
	}

	const index = limit * (page - 1)
	const url = http.buildUrl(`${BASE_URL}/search/artist`, {
		q: query,
		index: index.toString(),
		limit: limit.toString()
	})

	let response: Response
	try {
		response = await fetch(url)
	} catch (error) {
		throw new CatalogError(`Failed to search artists ${query}: ${errors.from(error).message}`)
	}

	if (!response.ok) {
		let body: unknown
		try {
			body = await response.clone().json()
		} catch {
			body = await response.text()
		}
		throw new CatalogError(`Bad response when searching artists ${query}: ${response.status} - ${JSON.stringify(body)}`)
	}

	const body = await response.json()
	let parsedBody: DeezerResponse
	try {
		parsedBody = zDeezerResponse.parse(body)
	} catch (error) {
		throw new CatalogError(`Failed to parse response whem searching artists ${query}: ${errors.from(error).message}`)
	}

	return paginate.fromSubset(parsedBody.data, { currentPage: page, pageSize: limit, totalItems: parsedBody.total })
}
