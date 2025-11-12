import { describe, it, expect } from "vitest"
import { uuid } from "#/random/random"

describe("uuid", () => {
	it("should return a string", () => {
		const result = uuid()
		expect(typeof result).toBe("string")
	})

	it("should return a valid UUID v4 format", () => {
		const result = uuid()
		// UUID v4 regex
		const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		expect(uuidV4Regex.test(result)).toBe(true)
	})

	it("should return unique values for consecutive calls", () => {
		const a = uuid()
		const b = uuid()
		expect(a).not.toBe(b)
	})
})
