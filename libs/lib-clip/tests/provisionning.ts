import spotifyTracks from "./spotify.json"
import matches from "./matches.json"
import wrongs from "./wrongs.json"
import notFounds from "./not-founds.json"
import { logger } from "lib-logger"
import readline from "readline/promises"
import { writeFile } from "fs/promises"
import { findTrack } from "#/find/find"

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

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
			logger.warn("No match found");
			(notFounds as string[]).push(spotifyTrack.id)
			continue
		}

		logger.info("Match found:", foundTrack.clip)
		while (true) {
			const input = await rl.question("Correct or not? (y|n|q)")
			if (input === "y") {
				logger.info("Correct")
				matches.push({ deezerId: foundTrack.id, spotifyId: spotifyTrack.id })
				break
			} else if (input === "n") {
				logger.info("Wrong");
				(wrongs as string[]).push(spotifyTrack.id)
				break
			} else if (input === "q") {
				logger.info("Quit")
				quit = true
				break
			}
		}

		if (quit) {
			break
		}
	}

	await writeFile("tests/matches.json", JSON.stringify(matches))
	await writeFile("tests/not-founds.json", JSON.stringify(notFounds))
	await writeFile("tests/wrongs.json", JSON.stringify(wrongs))
}

provisionning()
