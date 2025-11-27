import { describe, it, expect } from "vitest"
import { normalizeString, computeSearchQuery, stringifyParams } from "#/utils/utils"
import type { FindClipParams } from "#/types"

const params = (title: string, artist: string, album: string): FindClipParams => ({
	title,
	artist,
	album
})

describe("normalizeString", () => {
	it("lowercases the string", () => {
		expect(normalizeString("HeLLo")).toBe("hello")
	})

	it("collapses multiple spaces into one", () => {
		expect(normalizeString("a   b    c")).toBe("a b c")
	})

	it("trims leading and trailing spaces", () => {
		expect(normalizeString("   hello world   ")).toBe("hello world")
	})

	it("handles empty string", () => {
		expect(normalizeString("")).toBe("")
	})
})

describe("computeSearchQuery", () => {
	it("concatenates title and artist and normalizes the result", () => {
		const params = {
			title: "  Hello   ",
			artist: "  WORld  ",
			album: "ignored"
		}

		expect(computeSearchQuery(params)).toBe("hello world")
	})

	it("handles extra spaces in both fields", () => {
		const params = {
			title: "  My   Song ",
			artist: "  The   Artist ",
			album: "x"
		}

		expect(computeSearchQuery(params)).toBe("my song the artist")
	})
})

describe("stringifyParams", () => {
	it("formats correctly with normal values", () => {
		const p = params("Title", "Artist", "Album")
		expect(stringifyParams(p)).toBe("Artist - Title (Album)")
	})

	it("handles empty strings", () => {
		const p = params("", "", "")
		expect(stringifyParams(p)).toBe(" -  ()")
	})

	it("supports special characters", () => {
		const p = params("T!tle", "Ärtïst", "Albüm 2024")
		expect(stringifyParams(p)).toBe("Ärtïst - T!tle (Albüm 2024)")
	})

	it("keeps spacing intact", () => {
		const p = params(" My Title ", " My Artist ", " My Album ")
		expect(stringifyParams(p)).toBe(" My Artist  -  My Title  ( My Album )")
	})
})
