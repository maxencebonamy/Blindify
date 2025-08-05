import { encode, decode } from "#/stringify"
import { describe, it, expect } from "vitest"

describe("Custom JSON encode/decode", () => {
	it("encodes and decodes a string", () => {
		const input = "test string"
		const json = encode(input)
		const output = decode(json)
		expect(output).toBe(input)
	})

	it("encodes and decodes numbers including special cases", () => {
		const testValues = [ 0, -1, 3.14, NaN, Infinity, -Infinity ]
		for (const val of testValues) {
			const json = encode(val)
			const output = decode(json)
			if (Number.isNaN(val)) {
				expect(Number.isNaN(output as number)).toBe(true)
			} else {
				expect(output).toBe(val)
			}
		}
	})

	it("encodes and decodes booleans", () => {
		expect(decode(encode(true))).toBe(true)
		expect(decode(encode(false))).toBe(false)
	})

	it("encodes and decodes bigint values", () => {
		const bigints = [ BigInt(0), BigInt("12345678901234567890"), BigInt("-9876543210") ]
		for (const val of bigints) {
			const json = encode(val)
			const output = decode(json)
			expect(output).toBe(val)
		}
	})

	it("encodes and decodes null and undefined", () => {
		expect(decode(encode(null))).toBe(null)
		expect(decode(encode(undefined))).toBe(undefined)
	})

	it("encodes and decodes Date objects", () => {
		const now = new Date()
		const json = encode(now)
		const output = decode(json)
		expect(output instanceof Date).toBe(true)
		expect((output as Date).toISOString()).toBe(now.toISOString())
	})

	it("encodes and decodes arrays with mixed types", () => {
		const input = [ null, undefined, "str", 42, true, BigInt(9001), new Date("2020-01-01") ]
		const json = encode(input)
		const output = decode(json)
		expect(Array.isArray(output)).toBe(true)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - output is an array
		expect(output.length).toBe(input.length)
		// compare element-wise, using special checks for NaN and Date
		for (let i = 0; i < input.length; i++) {
			const inVal = input[i]
			const outVal = (output as unknown[])[i]

			if (typeof inVal === "number" && Number.isNaN(inVal)) {
				expect(Number.isNaN(outVal as number)).toBe(true)
			} else if (inVal instanceof Date) {
				expect(outVal instanceof Date).toBe(true)
				expect((outVal as Date).toISOString()).toBe(inVal.toISOString())
			} else {
				expect(outVal).toEqual(inVal)
			}
		}
	})

	it("encodes and decodes plain objects with mixed types", () => {
		const input = {
			str: "string",
			num: 123,
			nan: NaN,
			inf: Infinity,
			ninf: -Infinity,
			bool: false,
			nullVal: null,
			undef: undefined,
			bigint: BigInt("9007199254740991"),
			date: new Date("2022-12-31T23:59:59Z"),
			arr: [ 1, 2, 3 ],
			nested: { a: "b", c: [ true, false, null ] }
		}
		const json = encode(input)
		const output = decode(json) as Record<string, unknown>

		// Check top-level keys exist
		expect(Object.keys(output)).toEqual(Object.keys(input))

		// Spot-check some values
		expect(output.str).toBe(input.str)
		expect(output.num).toBe(input.num)
		expect(Number.isNaN(output.nan as number)).toBe(true)
		expect(output.inf).toBe(Infinity)
		expect(output.ninf).toBe(-Infinity)
		expect(output.bool).toBe(false)
		expect(output.nullVal).toBe(null)
		expect(output.undef).toBe(undefined)
		expect(output.bigint).toBe(input.bigint)
		expect(output.date instanceof Date).toBe(true)
		expect((output.date as Date).toISOString()).toBe(input.date.toISOString())
		expect(Array.isArray(output.arr)).toBe(true)
		expect(output.arr).toEqual(input.arr)
		expect(typeof output.nested).toBe("object")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((output.nested as any).a).toBe("b")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((output.nested as any).c).toEqual([ true, false, null ])
	})

	it("throws an error when encoding unsupported types", () => {
		const unsupportedValues = [
			() => {},
			Symbol("sym"),
			new Map(),
			new Set(),
			/regex/,
			new WeakMap(),
			new WeakSet()
		]
		for (const val of unsupportedValues) {
			expect(() => encode(val)).toThrow()
		}
	})

	it("throws an error when decoding invalid encoded JSON", () => {
		const invalidJsons = [
			"{\"type\":\"unknown\"}",
			"{\"type\":\"string\"}", // missing value
			"{\"type\":\"array\",\"value\":[{\"type\":\"string\"}]}", // nested missing value
			"{\"type\":\"object\",\"value\":{\"key\":{}}}", // missing type
			"null",
			"42",
			"\"string\""
		]
		for (const json of invalidJsons) {
			expect(() => decode(json)).toThrow()
		}
	})
})
