import { getClip } from "#/services/clip"
import { getAllTracksFromPlaylist } from "#/services/track"
import { zGame, type Game, type GameSettings } from "#/types/game.type"
import type { Playlist } from "#/types/playlist.type"
import type { Sample, SampleMinimal } from "#/types/sample.type"
import type { Track } from "#/types/track.type"
import { zTrack } from "#/types/track.type"
import { generateUUID, scrambleArray } from "#/utils/random"
import { cache } from "lib-cache"
import { logger } from "lib-logger"
import z from "zod"

export const createGame = async (playlist: Playlist, settings: GameSettings): Promise<Game> => {
	const id = generateUUID()

	const game: Game = {
		id,
		status: "loading",
		startTime: null,
		endTime: null,
		settings,
		currentSampleIndex: 0,
		playlist,
		samples: []
	}
	await cache.set(`game:${id}`, game)

	return game
}

export const loadGame = async (accessToken: string, game: Game): Promise<Game> => {
	const tracks = await getAllTracksFromPlaylist(accessToken, game.playlist.id)
	scrambleArray(tracks)

	const samples: SampleMinimal[] = []

	for (const track of tracks) {
		const clip = await getClip(track)
		if (clip === null) continue

		const sampleId = generateUUID()
		await cache.set(`clip:${sampleId}`, clip)
		await cache.set(`track:${sampleId}`, track)

		samples.push({
			id: sampleId,
			order: samples.length
		})
		if (samples.length >= game.settings.sampleCount) break
	}

	// TODO: update settings if no enough samples have been found

	game.samples = samples
	game.status = "ongoing"
	await cache.set(`game:${game.id}`, game)
	logger.debug(`Game ${game.id} loaded`)

	return game
}

export const getGameById = async (gameId: string): Promise<Game> => {
	const game = await cache.get(`game:${gameId}`, zGame)
	return game
}

export const getCurrentSampleGame = async (gameId: string): Promise<Sample> => {
	const game = await getGameById(gameId)
	const minimalSample = game.samples.sort((a, b) => a.order - b.order)[game.currentSampleIndex]
	if (!minimalSample) {
		throw new Error("Game has not enough samples")
	}

	const clipUrl = await cache.get(`clip:${minimalSample.id}`, z.string())
	const sample: Sample = {
		...minimalSample,
		clipUrl
	}

	return sample
}

export const getCurrentTrackGame = async (gameId: string): Promise<Track> => {
	const game = await getGameById(gameId)
	const minimalSample = game.samples.sort((a, b) => a.order - b.order)[game.currentSampleIndex]
	if (!minimalSample) {
		throw new Error("Game has not enough samples")
	}

	const track = await cache.get(`track:${minimalSample.id}`, zTrack)
	return track
}

export const nextSampleGame = async (gameId: string): Promise<Game> => {
	const game = await getGameById(gameId)

	if (game.status !== "ongoing") {
		throw new Error("Game status is not ongoing")
	}

	if (game.currentSampleIndex < game.samples.length - 1) {
		game.currentSampleIndex++
	} else {
		game.status = "finished"
	}

	await cache.set(`game:${gameId}`, game)

	return game
}
