import { PlatformConnectorError } from "#/error"
import { convertUser } from "#/spotify/convert"
import { getCurrentUsersProfile } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"
import { errors } from "lib-utils"

export const getCurrentUser: PlatformConnector["getCurrentUser"] = async accessToken => {
	const user = await getCurrentUsersProfile({
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new PlatformConnectorError(`Failed to get current user: ${result.error.error.message}`)
		}
		return result.data
	})

	try {
		return convertUser(user)
	} catch (error) {
		throw new PlatformConnectorError(`Failed to convert user: ${errors.from(error).message} (${JSON.stringify(user)})`)
	}
}
