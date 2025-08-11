import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

const endpoints = [
	await import("#/routes/auth/login/get"),
	await import("#/routes/auth/callback/get"),
	await import("#/routes/auth/logout/post"),
	await import("#/routes/auth/me/get"),
	await import("#/routes/playlists/me/get"),
	await import("#/routes/playlists/test/get"),
	await import("#/routes/health/get")
]

export const routes = async (app: FastifyInstance): Promise<void> => {
	await Promise.all(endpoints.map(e => app.withTypeProvider<ZodTypeProvider>().route(e)))
}
