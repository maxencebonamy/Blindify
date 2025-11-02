import type { FindClipParams } from "#/types"
import { normalizeString } from "#/utils"
import jaroWinkler from "jaro-winkler"

function normalizeTrack(track: FindClipParams): string {
	return normalizeString(`${track.title} ${track.artist} ${track.album}`)
}

function bagOfWords(str: string): Map<string, number> {
	const map = new Map<string, number>()
	for (const token of str.split(" ")) {
		map.set(token, (map.get(token) ?? 0) + 1)
	}
	return map
}

function fuzzyCosineSimilarity(
	a: Map<string, number>,
	b: Map<string, number>,
	threshold = 0.9
): number {
	const matchedB = new Set<string>()
	let dot = 0
	let normA = 0
	let normB = 0

	for (const [ tokenA, freqA ] of a.entries()) {
		let bestMatch: string | null = null
		let bestScore = 0

		for (const [ tokenB ] of b.entries()) {
			if (matchedB.has(tokenB)) continue
			const sim = jaroWinkler(tokenA, tokenB)
			if (sim > bestScore) {
				bestScore = sim
				bestMatch = tokenB
			}
		}

		if (bestMatch && bestScore >= threshold) {
			const freqB = b.get(bestMatch)
			matchedB.add(bestMatch)
			if (freqB) dot += freqA * freqB * bestScore
		}

		normA += freqA * freqA
	}

	for (const freqB of b.values()) normB += freqB * freqB

	return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0
}

export function trackSimilarity(a: FindClipParams, findClipParams: FindClipParams): number {
	const normA = normalizeTrack(a)
	const normB = normalizeTrack(findClipParams)
	const bagA = bagOfWords(normA)
	const bagB = bagOfWords(normB)
	return fuzzyCosineSimilarity(bagA, bagB)
}
