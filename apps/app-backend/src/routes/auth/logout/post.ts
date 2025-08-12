import type { Handler, Schema } from "#/types/fastify"
import z from "zod"

export const schema = {
	operationId: "authLogout",
	description: "Logout from Spotify",
	tags: [ "auth" ],
	response: {
		200: z.object({
			message: z.string()
		}),
		500: z.object({
			error: z.string()
		})
	}
} satisfies Schema

export const handler: Handler<typeof schema> = async (_, reply) => {
	return reply.clearCookie("access_token", {
		path: "/",
		httpOnly: true,
		secure: false
	}).send({ message: "Logout successful" })
}
