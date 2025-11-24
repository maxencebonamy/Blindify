import { describe, it, expect, vi, beforeEach } from "vitest"
import { z } from "zod"
import { createEnv } from "#/env"

describe("createEnv", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("parses env correctly for node type", () => {
		const schema = z.object({ PORT: z.string() })
		const env = { PORT: "3000" }

		const result = createEnv("node", env, schema)
		expect(result.PORT).toBe("3000")
	})

	it("parses env correctly for vite type", () => {
		const schema = z.object({ MODE: z.string() })
		const env = { MODE: "development" }

		const result = createEnv("vite", env, schema)
		expect(result.MODE).toBe("development")
	})

	it("throws an error when schema validation fails in vite mode", () => {
		const schema = z.object({ PORT: z.string() })
		const env = { PORT: 3000 } // number instead of string

		expect(() => createEnv("vite", env, schema)).toThrow(/Failed to parse env/)
	})

	it("logs and exits process on node mode validation failure", () => {
		const schema = z.object({ PORT: z.string() })
		const env = { PORT: 3000 }

		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
			throw new Error("process.exit called")
		})

		expect(() => createEnv("node", env, schema)).toThrow("process.exit called")
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Failed to parse env"))
		expect(exitSpy).toHaveBeenCalledWith(1)

		consoleSpy.mockRestore()
		exitSpy.mockRestore()
	})
})
