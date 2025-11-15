import type { Platform, Session } from "lib-database"
import { database } from "lib-database"
import type { Token } from "lib-platform-connector"

export const create = async (token: Token, platform: Platform): Promise<Session> => {
	const session = await database.session.create({
		data: {
			...token,
			platform
		}
	})

	return session
}
