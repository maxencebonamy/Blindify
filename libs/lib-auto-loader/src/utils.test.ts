import { describe, it, expect } from "vitest"
import { pluralize } from "#/utils"

describe("pluralize", () => {
	it("returns singular when count is 1 or -1", () => {
		expect(pluralize(1, "apple")).toBe("1 apple")
		expect(pluralize(-1, "apple")).toBe("-1 apple")
	})

	it("returns singular when count is 0", () => {
		expect(pluralize(0, "apple")).toBe("0 apple")
	})

	it("returns plural when count > 1 or < -1", () => {
		expect(pluralize(2, "apple")).toBe("2 apples")
		expect(pluralize(10, "banana")).toBe("10 bananas")
		expect(pluralize(-2, "apple")).toBe("-2 apples")
	})

	it("works with empty string", () => {
		expect(pluralize(3, "")).toBe("3 s")
		expect(pluralize(1, "")).toBe("1 ")
	})
})
