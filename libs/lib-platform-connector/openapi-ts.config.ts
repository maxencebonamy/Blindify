import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig([
	{
		input: "src/spotify/openapi.yaml",
		output: "src/spotify/generated",
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
	},
	{
		input: "src/deezer/openapi.yaml",
		output: "src/deezer/generated",
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
	}
])
