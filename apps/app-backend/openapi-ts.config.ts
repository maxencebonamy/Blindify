import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
	input: "openapi-spotify.yaml",
	output: "src/generated",
	experimentalParser: true,
	plugins: [
		"@hey-api/sdk",
		"@hey-api/client-fetch",
		"zod",
		{
			dates: true,
			name: "@hey-api/transformers"
		}
	]
})
