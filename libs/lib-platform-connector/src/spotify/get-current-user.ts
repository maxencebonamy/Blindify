import { convertUser } from "#/spotify/convert"
import { getCurrentUsersProfile } from "#/spotify/generated"
import type { PlatformConnector } from "#/types"

export const getCurrentUser: PlatformConnector["getCurrentUser"] = async accessToken => {
	const user = await getCurrentUsersProfile({
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (result.error) {
			throw new Error(`Failed to fetch user: ${result.error.error.message}`)
		}
		return result.data
	})

	return convertUser(user)
}
