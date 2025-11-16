import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "src"),
			"lib-database": path.resolve(__dirname, "../lib-database/src"),
			"lib-logger": path.resolve(__dirname, "../lib-logger/src"),
			"lib-platform-connector": path.resolve(__dirname, "../lib-platform-connector/src")
		}
	},
	test: {
		globals: true,
		environment: "node",
		passWithNoTests: true,
		env: {
			SPOTIFY_CLIENT_ID: "",
			SPOTIFY_CLIENT_SECRET: ""
		}
	}
})
