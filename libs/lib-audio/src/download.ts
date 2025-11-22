import type { Audio } from "#/types"
import { parseBuffer } from "music-metadata"

export const fromUrl = async (url: string): Promise<Audio> => {
	const response = await fetch(url)
	const arrayBuffer = await response.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)

	const metadata = await parseBuffer(buffer)

	return {
		buffer,
		durationMs: metadata.format.duration ?? 30_000
	}
}
