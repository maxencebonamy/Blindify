import { env } from "#/config/env"
import { getAllTracksFromPlaylist } from "#/services/track"
import type { GameMinimal } from "#/types/game.type"
import { minimizeGame, zGame, zGameMinimal, type Game, type GameSettings } from "#/types/game.type"
import type { Sample, SampleMinimal } from "#/types/sample.type"
import { audio } from "lib-audio"
import { cache } from "lib-cache"
import { findClip } from "lib-clip"
import type { Playlist, Track } from "lib-platform-connector"
import { zTrack } from "lib-platform-connector"
import { arrays, random } from "lib-utils"
import z from "zod"

export const getAllGames = async (): Promise<GameMinimal[]> => {
	try {
		const games = await cache.get("games", z.array(zGameMinimal))
		return games
	} catch {
		return []
	}
}

export const registerGame = async (game: GameMinimal): Promise<void> => {
	const games = await getAllGames()
	games.push(game)
	await cache.set("games", games)
}

export const createGame = async (playlist: Playlist, settings: GameSettings): Promise<Game> => {
	const id = random.uuid()

	const game: Game = {
		id,
		status: "loading",
		startTime: null,
		endTime: null,
		settings,
		currentSampleIndex: 0,
		playlist,
		nextActionAt: null,
		samples: [],
		currentSample: null,
		currentTrack: null
	}
	await cache.set(`game:${id}`, game)

	await registerGame(minimizeGame(game))

	return game
}

export const loadGame = async (accessToken: string, game: Game): Promise<Game> => {
	const tracks = await getAllTracksFromPlaylist(accessToken, game.playlist.id)
	arrays.scramble(tracks)

	const samples: SampleMinimal[] = []

	for (const track of tracks) {
		const clip = await findClip({ ...track, artist: track.artists.map(e => e.name).join(", "), album: track.album.name })
		if (clip === null) continue

		const clipId = random.uuid()
		let buffer = await audio.fromUrl(clip, 30_000)
		buffer = await audio.transform(buffer, { fadeInMs: 500, fadeOutMs: 2000, trimMs: 10_000 + game.settings.sampleDurationMs })
		await cache.set(`audio:${clipId}`, buffer.buffer.toString("base64"))
		await cache.set(`clip:${clipId}`, `${env.APP_URL}/audio/${clipId}`)
		await cache.set(`track:${clipId}`, track)

		samples.push({
			id: clipId,
			order: samples.length
		})
		if (samples.length >= game.settings.sampleCount) break
	}

	// TODO: update settings if no enough samples have been found

	game.samples = samples
	game.status = "ready"
	await cache.set(`game:${game.id}`, game)

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
