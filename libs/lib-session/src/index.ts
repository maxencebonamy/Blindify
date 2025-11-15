import { create } from "#/create/create"
import { retrieve } from "#/retrieve/retrieve"
import { revoke } from "#/revoke/revoke"

export const sessions = {
	create,
	retrieve,
	revoke
}

export type { Session } from "lib-database"
