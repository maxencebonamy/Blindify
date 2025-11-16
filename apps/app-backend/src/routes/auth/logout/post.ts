import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
import { sessions } from "lib-session"
import z from "zod"

export const schema = {
	operationId: "authLogout",
	description: "Logout from Spotify",
	auth: true,
	tags: [ "auth" ],
	response: {
		200: z.object({
			message: z.string()
		})
	}
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (request, reply) => {
	await sessions.revoke(request.session.id)

	return reply.clearCookie("session_id", {
		path: "/",
		httpOnly: true,
		secure: false
	}).send({ message: "Logout successful" })
}
