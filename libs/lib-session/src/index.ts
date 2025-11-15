import { create } from "#/create/create"
import { retrieve } from "#/retrieve/retrieve"
import { revoke } from "#/revoke/revoke"

export const session = {
	create,
	retrieve,
	revoke
}

export type { Session } from "lib-database"
