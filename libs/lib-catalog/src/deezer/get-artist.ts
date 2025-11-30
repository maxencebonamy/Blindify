import { BASE_URL } from "#/deezer/common"
import { zDeezerArtist } from "#/deezer/types"
import { CatalogError } from "#/errors"
import { type CatalogArtist } from "#/types"
import { errors } from "lib-utils"

export const getArtist = async (artistId: number): Promise<CatalogArtist> => {
	if (!artistId) {
		throw new CatalogError("Parameter artistId is empty")
	}

	let response: Response
	try {
		response = await fetch(`${BASE_URL}/artist/${artistId}`)
	} catch (error) {
		throw new CatalogError(`Failed to get artist ${artistId}: ${errors.from(error).message}`)
	}

	if (!response.ok) {
		let body: unknown
		try {
			body = await response.clone().json()
		} catch {
			body = await response.text()
		}
		throw new CatalogError(`Bad response when getting artist ${artistId}: ${response.status} - ${JSON.stringify(body)}`)
	}

	const body = await response.json()
	let parsedBody: CatalogArtist
	try {
		parsedBody = zDeezerArtist.parse(body)
	} catch (error) {
		throw new CatalogError(`Failed to parse response whem getting artist ${artistId}: ${errors.from(error).message}`)
	}

	return parsedBody
}
