import { Readable } from "stream"
import ffmpeg from "fluent-ffmpeg"

export const fadeOut = async (input: Buffer): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		const inputStream = Readable.from(input)
		const chunks: Buffer[] = []

		ffmpeg()
			.input(inputStream)
			.inputFormat("mp3")
			.audioFilters([
				"atempo=1.2",
				"afade=t=out:st=5:d=2"
			])
			.format("mp3")
			.on("error", reject)
			.on("end", () => resolve(Buffer.concat(chunks)))
			.pipe()
			.on("data", (d: Buffer) => chunks.push(d))
	})
}
