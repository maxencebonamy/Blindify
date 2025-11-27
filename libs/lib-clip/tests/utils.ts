import readline from "readline/promises"
import player from "play-sound"
import https from "https"
import fs from "fs"
import { logger } from "lib-logger"
import { errors } from "lib-utils"
import type { ChildProcess } from "child_process"

const AUDIO_PATH = "./tests/audio.mp3"

const reader = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

export const input = async (question: string): Promise<string> => {
	return await reader.question(question)
}

const downloadAudio = (url: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(AUDIO_PATH)

		https.get(url, res => {
			if (res.statusCode !== 200) {
				return reject(new Error(`Status: ${res.statusCode}`))
			}

			res.pipe(file)

			file.on("finish", () => {
				file.close(() => resolve())
			})
		}).on("error", err => {
			fs.unlink(AUDIO_PATH, () => reject(err))
		})
	})
}

const deleteAudio = (): void => {
	fs.unlink(AUDIO_PATH, () => undefined)
}

export const playAudio = async (url: string): Promise<ChildProcess> => {
	try {
		await downloadAudio(url)
	} catch (error) {
		logger.error(`Failed to download audio: ${errors.from(error).message}`)
	}
	const audio = player().play(AUDIO_PATH, () => undefined)
	return audio
}

export const stopAudio = async (audio: ChildProcess): Promise<void> => {
	audio.kill()
	deleteAudio()
}
