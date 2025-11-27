import spotifyTracks from "$/data/spotify.json"
import matches from "$/data/matches.json"
import wrongs from "$/data/wrongs.json"
import notFounds from "$/data/not-founds.json"
import { logger } from "lib-logger"
import { writeFile } from "fs/promises"
import { findTrack } from "#/find/find"
import { input, playAudio, stopAudio } from "$/utils"
import type { ChildProcess } from "child_process"

const provisionning = async (): Promise<void> => {
	let quit = false

	for (const spotifyTrack of spotifyTracks) {
		const params = {
			title: spotifyTrack?.title ?? "",
			album: spotifyTrack?.album.name ?? "",
			artist: spotifyTrack?.artists.map(e => e.name).join(", ") ?? ""
		}

		if (matches.find(e => e.spotifyId === spotifyTrack.id)) {
			continue
		}
		if (notFounds.find(e => e === spotifyTrack.id)) {
			continue
		}
		if (wrongs.find(e => e === spotifyTrack.id)) {
			continue
		}

		logger.info(JSON.stringify(params))

		const foundTrack = await findTrack(params)
		if (!foundTrack) {
			logger.warn("No match found")
			notFounds.push(spotifyTrack.id)
			continue
		}

		logger.info("Match found:", foundTrack.clip)
		let audio: ChildProcess | null = await playAudio(foundTrack.clip)
		while (true) {
			const response = await input("Correct or not? (y=yes, n=no, s=stop audio, q=quit): ")
			if (response === "y") {
				logger.info("Correct")
				matches.push({ deezerId: foundTrack.id, spotifyId: spotifyTrack.id })
				break
			}
			if (response === "n") {
				logger.info("Wrong")
				wrongs.push(spotifyTrack.id)
				break
			}
			if (response === "s") {
				logger.info("Stop audio")
				if (audio) stopAudio(audio)
				audio = null
			}
			if (response === "q") {
				logger.info("Quit")
				quit = true
				break
			}
		}
		if (audio) stopAudio(audio)

		if (quit) {
			break
		}
	}

	await writeFile("tests/data/matches.json", JSON.stringify(matches))
	await writeFile("tests/data/not-founds.json", JSON.stringify(notFounds))
	await writeFile("tests/data/wrongs.json", JSON.stringify(wrongs))

	process.exit(0)
}

provisionning()
