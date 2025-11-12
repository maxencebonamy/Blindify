import { describe, it, expect } from "vitest"
import { buildUrl } from "#/http/http"

describe("buildUrl", () => {
	it("should return the base URL unchanged if queryParams is empty", () => {
		const result = buildUrl("https://example.com", {})
		expect(result).toBe("https://example.com/")
	})

	it("should append a single query parameter", () => {
		const result = buildUrl("https://example.com", { foo: "bar" })
		expect(result).toBe("https://example.com/?foo=bar")
	})

	it("should append multiple query parameters", () => {
		const result = buildUrl("https://example.com", { foo: "bar", baz: "qux" })
		const url = new URL(result)
		expect(result).toBe("https://example.com/?foo=bar&baz=qux")
		expect(url.searchParams.get("foo")).toBe("bar")
		expect(url.searchParams.get("baz")).toBe("qux")
	})

	it("should override existing query parameters in the base URL", () => {
		const result = buildUrl("https://example.com?foo=old", { foo: "new", bar: "baz" })
		const url = new URL(result)
		expect(result).toBe("https://example.com/?foo=new&bar=baz")
		expect(url.searchParams.get("foo")).toBe("new")
		expect(url.searchParams.get("bar")).toBe("baz")
	})

	it("should encode special characters in query parameters", () => {
		const result = buildUrl("https://example.com", { "a b": "c d", "symbols": "!@#$" })
		const url = new URL(result)
		expect(result).toBe("https://example.com/?a+b=c+d&symbols=%21%40%23%24")
		expect(url.searchParams.get("a b")).toBe("c d")
		expect(url.searchParams.get("symbols")).toBe("!@#$")
	})

	it("should handle an empty base URL path", () => {
		const result = buildUrl("https://example.com", { foo: "bar" })
		expect(result).toBe("https://example.com/?foo=bar")
	})

	it("should handle a base URL with a trailing slash", () => {
		const result = buildUrl("https://example.com/", { foo: "bar" })
		expect(result).toBe("https://example.com/?foo=bar")
	})

	it("should handle query parameter values that are empty strings", () => {
		const result = buildUrl("https://example.com", { empty: "" })
		const url = new URL(result)
		expect(result).toBe("https://example.com/?empty=")
		expect(url.searchParams.get("empty")).toBe("")
	})

	it("should throw an error for invalid base URLs", () => {
		expect(() => buildUrl("invalid-url", { foo: "bar" })).toThrow()
	})

	it("should correctly handle URLs with existing multiple query parameters", () => {
		const result = buildUrl("https://example.com?foo=1&bar=2", { bar: "updated", baz: "3" })
		const url = new URL(result)
		expect(result).toBe("https://example.com/?foo=1&bar=updated&baz=3")
		expect(url.searchParams.get("foo")).toBe("1")
		expect(url.searchParams.get("bar")).toBe("updated")
		expect(url.searchParams.get("baz")).toBe("3")
	})
})
