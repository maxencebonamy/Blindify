import type { Session } from "lib-database"
import { database } from "lib-database"
import moment from "moment"

export const createSession = async (accessToken: string, refreshToken: string, accessExpiresAt: Date): Promise<string> => {
	const session = await database.session.create({
		data: {
			accessToken,
			refreshToken,
			accessExpiresAt
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
		return null
	}

	if (moment(session.accessExpiresAt).isBefore()) {
		// TODO: refresh session using refresh token
		await deleteSession(sessionId)
		return null
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
