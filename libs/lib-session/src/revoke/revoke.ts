import { database } from "lib-database"

export const revoke = async (sessionId: string): Promise<void> => {
	await database.session.delete({
		where: {
			id: sessionId
		}
	})
}
