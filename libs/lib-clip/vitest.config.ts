import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "src"),
			"$": path.resolve(__dirname, "tests"),
			"lib-logger": path.resolve(__dirname, "../lib-logger/dist")
		}
	},
	test: {
		globals: true,
		environment: "node",
		passWithNoTests: true,
		include: [
			"src/**/*.test.ts"
		]
	}
})
