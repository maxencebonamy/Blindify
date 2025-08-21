import type { AutoLoaderHandler, AutoLoaderSchema } from "lib-auto-loader"
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
} satisfies AutoLoaderSchema

export const handler: AutoLoaderHandler<typeof schema> = async (_, reply) => {
	return reply.clearCookie("access_token", {
		path: "/",
		httpOnly: true,
		secure: false
	}).send({ message: "Logout successful" })
}
