import { writeFile } from "node:fs/promises"
import { app } from "#/config/app"
import { exit } from "node:process"

await app.ready()

if (app.swagger === null || app.swagger === undefined) {
	throw new Error("@fastify/swagger plugin is not loaded")
}

const schema = app.swagger({ yaml: true })
await writeFile("openapi-backend.yaml", schema, { flag: "w+" })

await app.close()
exit(0)
