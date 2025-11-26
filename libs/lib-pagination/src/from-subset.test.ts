import { describe, it, expect } from "vitest"
import { fromSubset } from "#/from-subset"
import { PaginationError } from "#/error"

describe("fromSubset", () => {
	it("should return the first page correctly", () => {
		const items = [ 1, 2, 3 ]
		const page = fromSubset(items, { currentPage: 1, pageSize: 3, totalItems: 10 })
		expect(page.currentPage).toBe(1)
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBe(2)
		expect(page.totalItems).toBe(10)
		expect(page.totalPages).toBe(4)
		expect(page.items).toEqual(items)
	})

	it("should return a middle page correctly", () => {
		const items = [ 4, 5, 6 ]
		const page = fromSubset(items, { currentPage: 2, pageSize: 3, totalItems: 10 })
		expect(page.currentPage).toBe(2)
		expect(page.previousPage).toBe(1)
		expect(page.nextPage).toBe(3)
		expect(page.items).toEqual(items)
	})

	it("should return the last page correctly", () => {
		const items = [ 10 ]
		const page = fromSubset(items, { currentPage: 4, pageSize: 3, totalItems: 10 })
		expect(page.currentPage).toBe(4)
		expect(page.previousPage).toBe(3)
		expect(page.nextPage).toBeNull()
		expect(page.items).toEqual(items)
	})

	it("should throw if currentPage exceeds totalPages", () => {
		expect(() => fromSubset([ 1, 2, 3 ], { currentPage: 5, pageSize: 3, totalItems: 10 })).toThrow(PaginationError)
	})

	it("should throw if currentPage < 1", () => {
		expect(() => fromSubset([ 1, 2, 3 ], { currentPage: 0, pageSize: 3, totalItems: 10 })).toThrow(PaginationError)
	})

	it("should throw if pageSize < 1", () => {
		expect(() => fromSubset([ 1, 2, 3 ], { currentPage: 1, pageSize: 0, totalItems: 10 })).toThrow(PaginationError)
	})

	it("should throw if items length exceeds pageSize on non-last page", () => {
		expect(() => fromSubset([ 1, 2, 3, 4 ], { currentPage: 1, pageSize: 3, totalItems: 10 })).toThrow(PaginationError)
	})

	it("should fill items if items length is less than pageSize on non-last page", () => {
		const items = [ 4, 5 ]
		const page = fromSubset(items, { currentPage: 2, pageSize: 3, totalItems: 10, fillWith: 0 })
		expect(page.currentPage).toBe(2)
		expect(page.previousPage).toBe(1)
		expect(page.nextPage).toBe(3)
		expect(page.items).toEqual([ 4, 5, 0 ])
	})

	it("should throw if items length is less than pageSize on non-last page", () => {
		expect(() => fromSubset([ 1, 2 ], { currentPage: 2, pageSize: 3, totalItems: 10 })).toThrow(PaginationError)
	})

	it("should fill items if last page items length is incorrect", () => {
		// Last page should have 1 item (10th)
		const items: number[] = [ ]
		const page = fromSubset(items, { currentPage: 4, pageSize: 3, totalItems: 10, fillWith: 0 })
		expect(page.currentPage).toBe(4)
		expect(page.previousPage).toBe(3)
		expect(page.nextPage).toBeNull()
		expect(page.items).toEqual([ 0 ])
	})

	it("should throw if last page items length is incorrect", () => {
		// Last page should have 1 item (10th)
		expect(() => fromSubset([], { currentPage: 4, pageSize: 3, totalItems: 10 })).toThrow(PaginationError)
		expect(() => fromSubset([ 10, 11 ], { currentPage: 4, pageSize: 3, totalItems: 10 })).toThrow(PaginationError)
	})

	it("should handle empty totalItems array", () => {
		const page = fromSubset([], { currentPage: 1, pageSize: 5, totalItems: 0 })
		expect(page.totalItems).toBe(0)
		expect(page.totalPages).toBe(1)
		expect(page.items).toEqual([])
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBeNull()
	})

	it("should handle single item arrays", () => {
		const page = fromSubset([ 42 ], { currentPage: 1, pageSize: 1, totalItems: 1 })
		expect(page.previousPage).toBeNull()
		expect(page.nextPage).toBeNull()
		expect(page.items).toEqual([ 42 ])
	})

	it("should handle pageSize of 1 and multiple pages", () => {
		const items = [ 2 ]
		const page = fromSubset(items, { currentPage: 2, pageSize: 1, totalItems: 3 })
		expect(page.currentPage).toBe(2)
		expect(page.previousPage).toBe(1)
		expect(page.nextPage).toBe(3)
		expect(page.items).toEqual(items)
		expect(page.totalPages).toBe(3)
	})

	it("should correctly validate output page structure", () => {
		const items = [ 1, 2, 3 ]
		const page = fromSubset(items, { currentPage: 1, pageSize: 3, totalItems: 10 })
		expect(page).toHaveProperty("currentPage")
		expect(page).toHaveProperty("previousPage")
		expect(page).toHaveProperty("nextPage")
		expect(page).toHaveProperty("pageSize")
		expect(page).toHaveProperty("totalItems")
		expect(page).toHaveProperty("totalPages")
		expect(page).toHaveProperty("items")
	})

	it("should correctly handle last page with pageSize of 1", () => {
		const page = fromSubset([ 3 ], { currentPage: 3, pageSize: 1, totalItems: 3 })
		expect(page.items).toEqual([ 3 ])
		expect(page.previousPage).toBe(2)
		expect(page.nextPage).toBeNull()
		expect(page.totalPages).toBe(3)
	})
})
