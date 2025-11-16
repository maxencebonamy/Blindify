import { describe, it, expect, vi } from "vitest"
import { scramble } from "#/arrays/arrays"

describe("scramble", () => {
	it("should not throw for empty array", () => {
		const arr: number[] = []
		expect(() => scramble(arr)).not.toThrow()
		expect(arr).toEqual([])
	})

	it("should not change array with one element", () => {
		const arr = [ 42 ]
		scramble(arr)
		expect(arr).toEqual([ 42 ])
	})

	it("should shuffle an array in-place", () => {
		const arr = [ 1, 2, 3, 4, 5 ]
		const original = [ ...arr ]
		scramble(arr)
		// Array should contain same elements
		expect(arr.sort()).toEqual(original.sort())
	})

	it("should handle array with repeated elements", () => {
		const arr = [ 1, 2, 2, 3, 3, 3 ]
		const original = [ ...arr ]
		scramble(arr)
		expect(arr.sort()).toEqual(original.sort())
	})

	it("should not create a new array", () => {
		const arr = [ 1, 2, 3 ]
		const reference = arr
		scramble(arr)
		expect(arr).toBe(reference)
	})

	it("should shuffle array in-place deterministically when Math.random is mocked", () => {
		const arr = [ 1, 2, 3, 4 ]
		// Mock Math.random to control shuffle
		const mockRandom = vi.spyOn(Math, "random")
		// Values chosen to swap indices deterministically
		mockRandom.mockReturnValueOnce(0.5) // i = 3, j = floor(0.5*4) = 2
		mockRandom.mockReturnValueOnce(0.0) // i = 2, j = floor(0*3) = 0
		mockRandom.mockReturnValueOnce(0.9) // i = 1, j = floor(0.9*2) = 1

		scramble(arr)

		// Expected swaps based on mock:
		// Step 1: swap arr[3] and arr[2] => [1,2,4,3]
		// Step 2: swap arr[2] and arr[0] => [4,2,1,3]
		// Step 3: swap arr[1] and arr[1] => no change
		expect(arr).toEqual([ 4, 2, 1, 3 ])

		mockRandom.mockRestore()
	})
})
