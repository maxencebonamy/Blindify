import { zSampleMinimal } from "#/types/sample.type"
import { zPlaylist, zTrack } from "lib-platform-connector"
import z from "zod"

export const zChallengeMode = z.enum([ "classic", "reverse", "speed-up", "slow-down", "low-quality", "snippet" ])
export type ChallengeMode = z.infer<typeof zChallengeMode>

export const zGuessMode = z.enum([ "freeplay", "keyboard", "choice" ])
export type GuessMode = z.infer<typeof zGuessMode>

export const zGameSettings = z.object({
	challengeMode: zChallengeMode,
	guessMode: zGuessMode,
	sampleCount: z.union([ z.literal(10), z.literal(20), z.literal(30) ]),
	sampleDurationMs: z.union([ z.literal(10000), z.literal(20000) ])
})
export type GameSettings = z.infer<typeof zGameSettings>

export const zGameStatus = z.enum([ "loading", "ready", "listening", "revealing", "finished" ])
export type GameStatus = z.infer<typeof zGameStatus>

export const zGame = z.object({
	id: z.string(),
	playlist: zPlaylist,
	settings: zGameSettings,
	samples: z.array(zSampleMinimal),
	currentSampleIndex: z.number().int().min(0),
	status: zGameStatus,
	startTime: z.date().nullable(),
	endTime: z.date().nullable(),
	nextActionAt: z.date().nullable(),
	currentSample: z.string().nullable(),
	currentTrack: zTrack.nullable()
})
export type Game = z.infer<typeof zGame>

export const zGameMinimal = zGame.pick({
	id: true
})
export type GameMinimal = z.infer<typeof zGameMinimal>

export const minimizeGame = (game: Game): GameMinimal => ({
	id: game.id
})
