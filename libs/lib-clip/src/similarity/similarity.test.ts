import type { Mock } from "vitest"
import { describe, it, expect, vi } from "vitest"
import * as utils from "#/utils/utils"
import jaroWinkler from "jaro-winkler"
import { computeSimilarityScore } from "#/similarity/similarity"
import type { FindClipParams } from "#/types"

vi.mock("jaro-winkler", () => ({
	default: vi.fn()
}))

// normalizeString mock to make tests deterministic
vi.spyOn(utils, "normalizeString").mockImplementation((s: string) => s.toLowerCase().replace(/\s+/g, " ").trim())

const jw = jaroWinkler as unknown as Mock

const track = (title: string, artist: string, album: string): FindClipParams => ({ title, artist, album })

describe("computeSimilarityScore", () => {
	it("returns 0 when no words match", () => {
		jw.mockReturnValue(0)
		const a = track("aaa", "bbb", "ccc")
		const b = track("xxx", "yyy", "zzz")
		expect(computeSimilarityScore(a, b)).toBeLessThanOrEqual(0.01)
	})

	it("returns 1 for identical tracks", () => {
		jw.mockReturnValue(1)
		const a = track("Hello", "World", "Album")
		expect(computeSimilarityScore(a, a)).toBeGreaterThanOrEqual(0.99)
	})

	it("matches words above threshold", () => {
		jw.mockImplementation((w1: string, w2: string) => w1[0] === w2[0] ? 0.95 : 0.1)

		const a = track("Alpha Beta", "Gamma", "Delta")
		const b = track("Alpha Bee", "Gamma", "Delta")

		const result = computeSimilarityScore(a, b)
		expect(result).toBeGreaterThan(0)
	})

	it("ignores fuzzy matches below threshold", () => {
		jw.mockReturnValue(0.5)

		const a = track("Alpha Beta", "Gamma", "Delta")
		const b = track("Alpha Bee", "Gamma", "Delta")

		expect(computeSimilarityScore(a, b)).toBeLessThanOrEqual(0.01)
	})

	it("handles repeated words correctly", () => {
		jw.mockReturnValue(1)

		const a = track("song song", "artist", "album")
		const b = track("song", "artist", "album")

		const result = computeSimilarityScore(a, b)
		expect(result).toBeCloseTo((2 + 1 + 1) / Math.sqrt((4 + 1 + 1) * (1 + 1 + 1)), 5)
	})
})
