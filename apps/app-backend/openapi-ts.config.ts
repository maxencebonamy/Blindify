import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
	input: "https://developer.spotify.com/reference/web-api/open-api-schema.yaml",
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
