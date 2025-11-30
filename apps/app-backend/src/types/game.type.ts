import { zSampleMinimal } from "#/types/sample.type"
import { zCatalogArtist, zCatalogTrack } from "lib-catalog"
import z from "zod"

export const zGameSettings = z.object({
	sampleCount: z.union([ z.literal(10), z.literal(20), z.literal(30) ]),
	sampleDurationMs: z.union([ z.literal(10000), z.literal(20000) ])
})

export const zGameStatus = z.enum([ "loading", "ready", "listening", "revealing", "finished" ])

export const zGame = z.object({
	id: z.string(),
	artist: zCatalogArtist,
	settings: zGameSettings,
	samples: z.array(zSampleMinimal),
	currentSampleIndex: z.number().int().min(0),
	status: zGameStatus,
	startTime: z.date().nullable(),
	endTime: z.date().nullable(),
	nextActionAt: z.date().nullable(),
	currentSample: z.string().nullable(),
	currentTrack: zCatalogTrack.nullable()
})

export const zGameMinimal = zGame.pick({
	id: true
})

export type GameSettings = z.infer<typeof zGameSettings>
export type GameStatus = z.infer<typeof zGameStatus>
export type Game = z.infer<typeof zGame>
export type GameMinimal = z.infer<typeof zGameMinimal>

export const minimizeGame = (game: Game): GameMinimal => ({
	id: game.id
})
