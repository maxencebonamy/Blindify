import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "src"),
			"lib-logger": path.resolve(__dirname, "../lib-logger/src"),
			"lib-session": path.resolve(__dirname, "../lib-session/src")
		}
	},
	test: {
		globals: true,
		environment: "node",
		passWithNoTests: true
	}
})
