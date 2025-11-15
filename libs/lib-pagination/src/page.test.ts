import { describe, it, expect } from "vitest"
import { zPage } from "#/page"
import z from "zod"

describe("zPage schema", () => {
	const itemSchema = z.number() // simple type for items

	it("should validate a correct page", () => {
		const page = {
			currentPage: 1,
			previousPage: null,
			nextPage: 2,
			totalPages: 3,
			totalItems: 5,
			pageSize: 2,
			items: [ 1, 2 ]
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(true)
	})

	it("should fail if totalPages is incorrect", () => {
		const page = {
			currentPage: 1,
			previousPage: null,
			nextPage: 2,
			totalPages: 2, // should be 3
			totalItems: 5,
			pageSize: 2,
			items: [ 1, 2 ]
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues?.[0]?.path).toContain("totalPages")
		}
	})

	it("should fail if currentPage > totalPages", () => {
		const page = {
			currentPage: 4,
			previousPage: 3,
			nextPage: null,
			totalPages: 3,
			totalItems: 5,
			pageSize: 2,
			items: [ 5 ]
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues?.[0]?.path).toContain("currentPage")
		}
	})

	it("should fail if previousPage is wrong", () => {
		const page = {
			currentPage: 2,
			previousPage: 0, // should be 1
			nextPage: 3,
			totalPages: 3,
			totalItems: 5,
			pageSize: 2,
			items: [ 3, 4 ]
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues?.[0]?.path).toContain("previousPage")
		}
	})

	it("should fail if nextPage is wrong", () => {
		const page = {
			currentPage: 2,
			previousPage: 1,
			nextPage: 4, // should be 3
			totalPages: 3,
			totalItems: 5,
			pageSize: 2,
			items: [ 3, 4 ]
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues?.[0]?.path).toContain("nextPage")
		}
	})

	it("should fail if items exceed pageSize", () => {
		const page = {
			currentPage: 1,
			previousPage: null,
			nextPage: 2,
			totalPages: 3,
			totalItems: 5,
			pageSize: 2,
			items: [ 1, 2, 3 ] // too many
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues?.[0]?.path).toContain("items")
		}
	})

	it("should fail if last page items length does not match remaining items", () => {
		const page = {
			currentPage: 3,
			previousPage: 2,
			nextPage: null,
			totalPages: 3,
			totalItems: 5,
			pageSize: 2,
			items: [ 5, 6 ] // only 1 remaining item should be here
		}

		const result = zPage(itemSchema).safeParse(page)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues?.[0]?.path).toContain("items")
		}
	})
})
