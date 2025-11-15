import { describe, it, expect } from "vitest"
import { from } from "#/errors/errors"

describe("from", () => {
	it("should return the same Error instance if an Error is passed", () => {
		const err = new Error("original")
		const result = from(err)
		expect(result).toBe(err)
	})

	it("should convert a string to an Error", () => {
		const result = from("some error")
		expect(result).toBeInstanceOf(Error)
		expect(result.message).toBe("some error")
	})

	it("should convert a number to an Error", () => {
		const result = from(42)
		expect(result).toBeInstanceOf(Error)
		expect(result.message).toBe("42")
	})

	it("should convert a boolean to an Error", () => {
		const resultTrue = from(true)
		expect(resultTrue).toBeInstanceOf(Error)
		expect(resultTrue.message).toBe("true")

		const resultFalse = from(false)
		expect(resultFalse).toBeInstanceOf(Error)
		expect(resultFalse.message).toBe("false")
	})

	it("should convert null and undefined to an Error", () => {
		const resultNull = from(null)
		expect(resultNull).toBeInstanceOf(Error)
		expect(resultNull.message).toBe("null")

		const resultUndefined = from(undefined)
		expect(resultUndefined).toBeInstanceOf(Error)
		expect(resultUndefined.message).toBe("undefined")
	})

	it("should convert objects to an Error with string representation", () => {
		const obj = { a: 1 }
		const result = from(obj)
		expect(result).toBeInstanceOf(Error)
		expect(result.message).toBe("[object Object]")
	})

	it("should convert arrays to an Error with string representation", () => {
		const arr = [ 1, 2, 3 ]
		const result = from(arr)
		expect(result).toBeInstanceOf(Error)
		expect(result.message).toBe("1,2,3")
	})

	it("should convert symbols to an Error with string representation", () => {
		const sym = Symbol("test")
		const result = from(sym)
		expect(result).toBeInstanceOf(Error)
		expect(result.message).toBe("Symbol(test)")
	})
})
