import type { FastifyInstance } from "fastify"

const endpoints = [
	await import("#/routes/auth/login/get"),
	await import("#/routes/health/get")
]

export const routes = async (app: FastifyInstance): Promise<void> => {
	await Promise.all(endpoints.map(e => app.route(e)))
}
