import type { FindClipParams } from "#/types"
import { normalizeString } from "#/utils/utils"
import jaroWinkler from "jaro-winkler"

// frequency of each word in a string
type Bag = Map<string, number>

const normalizeTrack = (track: FindClipParams, includeAlbum: boolean): string => {
	return normalizeString(`${track.title} ${track.artist} ${includeAlbum ? track.album : ""}`)
}

const bagOfWords = (str: string): Bag => {
	const bag = new Map<string, number>()
	for (const word of str.split(" ")) {
		// if the word is already in the bag, we increment the frequency, otherwise we initialize it to 1
		bag.set(word, (bag.get(word) ?? 0) + 1)
	}
	return bag
}

const fuzzyCosineSimilarity = (bagA: Bag, bagB: Bag, threshold = 0.9): number => {
	const matchedB = new Set<string>()
	let dot = 0
	let normA = 0
	let normB = 0

	for (const [ wordA, frequencyA ] of bagA.entries()) {
		let bestMatch: string | null = null
		let bestScore = 0

		for (const [ wordB ] of bagB.entries()) {
			if (matchedB.has(wordB)) continue
			const sim = jaroWinkler(wordA, wordB)
			if (sim > bestScore) {
				bestScore = sim
				bestMatch = wordB
			}
		}

		if (bestMatch && bestScore >= threshold) {
			const frequencyB = bagB.get(bestMatch)
			matchedB.add(bestMatch)
			if (frequencyB) dot += frequencyA * frequencyB * bestScore
		}

		normA += frequencyA * frequencyA
	}

	for (const frequencyB of bagB.values()) normB += frequencyB * frequencyB

	return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0
}

export const computeSimilarityScore = (trackA: FindClipParams, trackB: FindClipParams, lax: boolean): number => {
	const normA = normalizeTrack(trackA, !lax)
	const normB = normalizeTrack(trackB, !lax)

	const bagA = bagOfWords(normA)
	const bagB = bagOfWords(normB)

	return fuzzyCosineSimilarity(bagA, bagB)
}
