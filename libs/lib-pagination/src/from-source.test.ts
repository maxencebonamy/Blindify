import { describe, it, expect } from "vitest"
import { fromSource } from "#/from-source"
import { PaginationError } from "#/error"

describe("fromSource", () => {
	const sampleItems = Array.from({ length: 10 }, (_, i) => i + 1) // [ 1, 2, ..., 10 ]

	it("should return the first page correctly", () => {
		const page = fromSource(sampleItems, { currentPage: 1, pageSize: 3 })
		expect(page.currentPage).toBe(1)
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBe(2)
		expect(page.totalItems).toBe(10)
		expect(page.totalPages).toBe(4)
		expect(page.pageSize).toBe(3)
		expect(page.items).toEqual([ 1, 2, 3 ])
	})

	it("should return a middle page correctly", () => {
		const page = fromSource(sampleItems, { currentPage: 2, pageSize: 3 })
		expect(page.currentPage).toBe(2)
		expect(page.previousPage).toBe(1)
		expect(page.nextPage).toBe(3)
		expect(page.items).toEqual([ 4, 5, 6 ])
	})

	it("should return the last page correctly", () => {
		const page = fromSource(sampleItems, { currentPage: 4, pageSize: 3 })
		expect(page.currentPage).toBe(4)
		expect(page.previousPage).toBe(3)
		expect(page.nextPage).toBeNull()
		expect(page.items).toEqual([ 10 ])
	})

	it("should handle pageSize equal to total items", () => {
		const page = fromSource(sampleItems, { currentPage: 1, pageSize: 10 })
		expect(page.totalPages).toBe(1)
		expect(page.items).toEqual(sampleItems)
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBeNull()
	})

	it("should handle pageSize larger than total items", () => {
		const page = fromSource(sampleItems, { currentPage: 1, pageSize: 20 })
		expect(page.totalPages).toBe(1)
		expect(page.items).toEqual(sampleItems)
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBeNull()
	})

	it("should throw if currentPage exceeds totalPages", () => {
		expect(() => fromSource(sampleItems, { currentPage: 5, pageSize: 3 })).toThrow(PaginationError)
	})

	it("should throw if currentPage is less than 1", () => {
		expect(() => fromSource(sampleItems, { currentPage: 0, pageSize: 3 })).toThrow(PaginationError)
	})

	it("should throw if pageSize is less than 1", () => {
		expect(() => fromSource(sampleItems, { currentPage: 1, pageSize: 0 })).toThrow(PaginationError)
	})

	it("should handle empty array", () => {
		const page = fromSource([], { currentPage: 1, pageSize: 5 })
		expect(page.totalItems).toBe(0)
		expect(page.totalPages).toBe(1)
		expect(page.items).toEqual([])
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBeNull()
	})

	it("should correctly compute previousPage and nextPage for single item arrays", () => {
		const page = fromSource([ 42 ], { currentPage: 1, pageSize: 1 })
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBeNull()
		expect(page.items).toEqual([ 42 ])
	})

	it("should handle pageSize of 1 for multiple items", () => {
		const page = fromSource([ 1, 2, 3 ], { currentPage: 2, pageSize: 1 })
		expect(page.currentPage).toBe(2)
		expect(page.previousPage).toBe(1)
		expect(page.nextPage).toBe(3)
		expect(page.items).toEqual([ 2 ])
		expect(page.totalPages).toBe(3)
	})

	it("should validate output page structure with Zod (implicit)", () => {
		const page = fromSource([ 1, 2, 3 ], { currentPage: 1, pageSize: 2 })
		expect(page).toHaveProperty("currentPage")
		expect(page).toHaveProperty("previousPage")
		expect(page).toHaveProperty("nextPage")
		expect(page).toHaveProperty("pageSize")
		expect(page).toHaveProperty("totalItems")
		expect(page).toHaveProperty("totalPages")
		expect(page).toHaveProperty("items")
	})

	it("should handle pageSize of 1 and last page correctly", () => {
		const page = fromSource([ 1, 2, 3 ], { currentPage: 3, pageSize: 1 })
		expect(page.items).toEqual([ 3 ])
		expect(page.previousPage).toBe(2)
		expect(page.nextPage).toBeNull()
		expect(page.totalPages).toBe(3)
	})
})
