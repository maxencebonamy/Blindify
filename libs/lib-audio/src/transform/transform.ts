import { Readable } from "stream"
import ffmpeg from "fluent-ffmpeg"
import { zTransformParams, type Audio, type TransformParams } from "#/types"
import { logger } from "lib-logger"

export const transform = async (input: Audio, params: TransformParams): Promise<Audio> => {
	const { trimMs, fadeInMs, fadeOutMs, tempo, reversed, sampleRateHz } = zTransformParams.parse(params)

	const filters: string[] = []

	if (trimMs) {
		filters.push(`atrim=duration=${(trimMs / 1000).toFixed(3)}`)
		input.durationMs = trimMs
	}

	if (fadeInMs) {
		filters.push(`afade=t=in:st=0:d=${(fadeInMs / 1000).toFixed(3)}`)
	}

	if (fadeOutMs) {
		filters.push(`afade=t=out:st=${((input.durationMs - fadeOutMs) / 1000).toFixed(3)}:d=${(fadeOutMs / 1000).toFixed(3)}`)
	}

	if (tempo) {
		filters.push(`atempo=${tempo.toFixed(3)}`)
	}

	if (reversed) {
		filters.push("areverse")
	}

	if (sampleRateHz) {
		filters.push(`asetrate=${sampleRateHz}`)
		filters.push("aresample=44100")
	}

	if (filters.length === 0) {
		return input
	}

	logger.debug(`Apply filters: ${JSON.stringify(filters)}`)

	return new Promise((resolve, reject) => {
		const inputStream = Readable.from(input.buffer)
		const chunks: Buffer[] = []

		ffmpeg()
			.input(inputStream)
			.inputFormat("mp3")
			.audioFilters(filters)
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
