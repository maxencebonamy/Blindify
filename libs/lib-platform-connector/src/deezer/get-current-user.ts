import { convertUser } from "#/deezer/convert"
import { getCurrentUser as getDeezerCurrentUser } from "#/deezer/generated"
import type { PlatformConnector } from "#/types"

export const getCurrentUser: PlatformConnector["getCurrentUser"] = async accessToken => {
	const user = await getDeezerCurrentUser({
		headers: { authorization: `Bearer ${accessToken}` }
	}).then(result => {
		if (!result.data || "error" in result.data) {
			throw new Error(`Failed to fetch user: ${result.data?.error.message}`)
		}
		return result.data
	})

	return convertUser(user)
}
