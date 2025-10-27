import { defineConfig } from "tsup"

export default defineConfig({
	entry: [ "src/**/*.ts" ],
	outDir: "dist",
	format: [ "esm" ],
	minify: false,
	clean: false,
	esbuildOptions(options) {
		options.alias = { "#": "src" }
	}
})
