import type { Session } from "lib-database"
import { database } from "lib-database"
import { logger } from "lib-logger"
import { connector, type Platform, type Token } from "lib-platform-connector"
import moment from "moment"

export const createSession = async (token: Token, platform: Platform): Promise<string> => {
	const session = await database.session.create({
		data: {
			...token,
			platform
		}
	})

	return session.id
}

export const getSession = async (sessionId: string): Promise<Session | null> => {
	const session = await database.session.findUnique({
		where: {
			id: sessionId
		}
	})

	if (!session) {
		logger.error(`Session ${sessionId} does not exist`)
		return null
	}

	if (moment(session.accessExpiresAt).isBefore()) {
		if (!session.refreshToken) {
			await deleteSession(sessionId)
			return null
		}

		logger.warn(`Session ${sessionId} has expired, trying to refresh it...`)

		const token = await connector(session.platform).oAuthTokenRefresh(session.refreshToken)
		if (!token.refreshToken) {
			token.refreshToken = session.refreshToken
		}

		await database.session.update({
			where: {
				id: sessionId
			},
			data: {
				...token
			}
		})

		logger.info(`Session ${sessionId} has been refreshed successfully`)
	}

	return session
}

export const deleteSession = async (sessionId: string): Promise<void> => {
	await database.session.delete({
		where: {
			id: sessionId
		}
	})
}
