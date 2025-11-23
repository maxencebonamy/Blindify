import type { Audio } from "#/types"
import { parseBuffer } from "music-metadata"

export const fromUrl = async (url: string, defaultDurationMs?: number): Promise<Audio> => {
	const response = await fetch(url)
	const arrayBuffer = await response.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)

	const metadata = await parseBuffer(buffer)
	const durationMs = metadata.format.duration ? metadata.format.duration * 1000 : defaultDurationMs

	if (!durationMs) {
		throw new Error("Failed to extract duration from audio and no default duration has been provided")
	}

	return {
		buffer,
		durationMs
	}
}
