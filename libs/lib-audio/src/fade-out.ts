import { Readable } from "stream"
import ffmpeg from "fluent-ffmpeg"
import type { Audio } from "#/types"
import { logger } from "lib-logger"

export type FadeOutParams = {
	durationSec: number
}

export const fadeOut = async (input: Audio, { durationSec }: FadeOutParams): Promise<Audio> => {
	return new Promise((resolve, reject) => {
		const inputStream = Readable.from(input.buffer)
		const chunks: Buffer[] = []
		logger.debug(durationSec)

		ffmpeg()
			.input(inputStream)
			.inputFormat("mp3")
			.audioFilters([
				"atempo=1.2",
				"afade=t=out:st=20:d=10"
			])
			.format("mp3")
			.on("error", reject)
			.on("end", () => resolve({
				...input,
				buffer: Buffer.concat(chunks)
			}))
			.pipe()
			.on("data", (d: Buffer) => chunks.push(d))
	})
}
