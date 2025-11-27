import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "src"),
			"lib-cache": path.resolve(__dirname, "../lib-cache/src")
		}
	},
	test: {
		globals: true,
		environment: "node",
		passWithNoTests: true
	}
})
