import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
	input: "openapi-backend.yaml",
	output: "src/generated",
	experimentalParser: true,
	plugins: [
		"@hey-api/client-fetch",
		"@tanstack/react-query",
		"zod",
		{
			dates: true,
			name: "@hey-api/transformers"
		}
	]
})
