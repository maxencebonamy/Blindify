import { zSampleMinimal } from "#/types/sample.type"
import { zPlaylist, zTrack } from "lib-platform-connector"
import z from "zod"

export const zGameSettings = z.object({
	sampleCount: z.union([ z.literal(10), z.literal(20), z.literal(30) ]),
	sampleDurationMs: z.union([ z.literal(10000), z.literal(20000) ])
})

export const zGameStatus = z.enum([ "loading", "ready", "listening", "revealing", "finished" ])

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

export const zGameMinimal = zGame.pick({
	id: true
})

export type GameSettings = z.infer<typeof zGameSettings>
export type GameStatus = z.infer<typeof zGameStatus>
export type Game = z.infer<typeof zGame>
export type GameMinimal = z.infer<typeof zGameMinimal>

z.globalRegistry.add(zGameSettings, { id: "GameSettings" })
z.globalRegistry.add(zGameStatus, { id: "GameStatus" })
z.globalRegistry.add(zGame, { id: "Game" })
z.globalRegistry.add(zGameMinimal, { id: "GameMinimal" })

export const minimizeGame = (game: Game): GameMinimal => ({
	id: game.id
})
