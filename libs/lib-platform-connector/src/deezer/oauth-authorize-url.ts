import type { PlatformConnector } from "#/types"

export const oAuthAuthorizeUrl: PlatformConnector["oAuthAuthorizeUrl"] = () => {
	throw new Error("Not implemented")
}
