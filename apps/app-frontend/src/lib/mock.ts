import { z } from "zod"

// Import types from the game settings
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unused-vars
const zPage = <T>(zItem: z.ZodType<T>) => z.object({
	page: z.number().int().min(1),
	previousPage: z.number().int().min(1).nullable(),
	nextPage: z.number().int().min(2).nullable(),
	totalPages: z.number().int().min(1),
	totalItems: z.number().int().min(0),
	pageSize: z.number().int().min(1),
	items: z.array(zItem)
})

const zPlaylist = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	coverUrl: z.string().url().nullable(),
	trackCount: z.number().int().min(0)
})

export const zGameSettings = z.object({
	samplesCount: z.union([ z.literal(10), z.literal(20), z.literal(30) ]),
	sampleDurationMs: z.union([ z.literal(2000), z.literal(5000), z.literal(10000), z.literal(20000) ])
})

export const zGameStatus = z.enum([ "loading", "ready", "listening", "reveal", "finished" ])

export const zSampleMinimal = z.object({
	id: z.string(),
	order: z.number().int().min(0)
})

export const zGame = z.object({
	id: z.string(),
	playlist: zPlaylist,
	settings: zGameSettings,
	samples: z.array(zSampleMinimal),
	currentSampleIndex: z.number().int().min(0),
	status: zGameStatus,
	startTime: z.date().nullable(),
	endTime: z.date().nullable()
})

export const zSample = z.object({
	id: z.string(),
	order: z.number().int().min(0),
	clipUrl: z.string().url()
})

export const zTrack = z.object({
	id: z.string(),
	title: z.string(),
	artists: z.array(z.string()).min(1),
	album: z.string(),
	coverUrl: z.string().url().nullable()
})

export type Page<T> = z.infer<ReturnType<typeof zPage<T>>>
export type Playlist = z.infer<typeof zPlaylist>
export type Game = z.infer<typeof zGame>
export type GameSettings = z.infer<typeof zGameSettings>
export type Sample = z.infer<typeof zSample>
export type Track = z.infer<typeof zTrack>
export type GameStatus = z.infer<typeof zGameStatus>

// Mock data
const mockPlaylists = [
	{
		id: "1",
		name: "Ultimate Rock Hits",
		description: "The best rock songs from the 70s to today",
		coverUrl: "/placeholder.svg?height=300&width=300",
		trackCount: 45
	},
	{
		id: "2",
		name: "Electronic Vibes",
		description: "Pulsating electronic beats and synths",
		coverUrl: "/placeholder.svg?height=300&width=300",
		trackCount: 32
	},
	{
		id: "3",
		name: "Jazz Classics",
		description: null,
		coverUrl: "/placeholder.svg?height=300&width=300",
		trackCount: 28
	},
	{
		id: "4",
		name: "Pop Anthems 2020s",
		description: "Chart-topping pop hits from this decade",
		coverUrl: "/placeholder.svg?height=300&width=300",
		trackCount: 50
	},
	{
		id: "5",
		name: "Indie Folk Journey",
		description: "Acoustic melodies and heartfelt lyrics",
		coverUrl: "/placeholder.svg?height=300&width=300",
		trackCount: 22
	},
	{
		id: "6",
		name: "Hip-Hop Essentials",
		description: "From old school to new school",
		coverUrl: "/placeholder.svg?height=300&width=300",
		trackCount: 38
	}
] as const satisfies Playlist[]

const mockTracks = [
	{
		id: "t1",
		title: "Bohemian Rhapsody",
		artists: [ "Queen" ],
		album: "A Night at the Opera",
		coverUrl: "/placeholder.svg?height=300&width=300"
	},
	{
		id: "t2",
		title: "Strobe",
		artists: [ "Deadmau5" ],
		album: "For Lack of a Better Name",
		coverUrl: "/placeholder.svg?height=300&width=300"
	},
	{
		id: "t3",
		title: "Take Five",
		artists: [ "Dave Brubeck" ],
		album: "Time Out",
		coverUrl: "/placeholder.svg?height=300&width=300"
	}
] as const satisfies Track[]

// Mock API functions
export const mockApi = {
	async getPlaylists(page = 1, limit = 20): Promise<Page<Playlist>> {
		await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay

		const startIndex = (page - 1) * limit
		const endIndex = startIndex + limit
		const items = mockPlaylists.slice(startIndex, endIndex)

		return {
			page,
			previousPage: page > 1 ? page - 1 : null,
			nextPage: endIndex < mockPlaylists.length ? page + 1 : null,
			totalPages: Math.ceil(mockPlaylists.length / limit),
			totalItems: mockPlaylists.length,
			pageSize: limit,
			items
		}
	},

	async createGame(playlistId: string, settings: GameSettings): Promise<Game> {
		await new Promise(resolve => setTimeout(resolve, 300))

		const playlist = mockPlaylists.find(p => p.id === playlistId)
		if (!playlist) throw new Error("Playlist not found")

		const samples = Array.from({ length: settings.samplesCount }, (_, i) => ({
			id: `sample-${i + 1}`,
			order: i
		}))

		return {
			id: `game-${Date.now()}`,
			playlist,
			settings,
			samples,
			currentSampleIndex: 0,
			status: "loading",
			startTime: null,
			endTime: null
		}
	},

	async getGame(gameId: string): Promise<Game> {
		await new Promise(resolve => setTimeout(resolve, 200))

		// Simulate game status progression\
		const mockGame: Game = {
			id: gameId,
			playlist: mockPlaylists[0],
			settings: { samplesCount: 10, sampleDurationMs: 5000 },
			samples: Array.from({ length: 10 }, (_, i) => ({
				id: `sample-${i + 1}`,
				order: i
			})),
			currentSampleIndex: 0,
			status: "ready",
			startTime: new Date(),
			endTime: null
		}

		return mockGame
	},

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getNextSample(_gameId: string): Promise<Sample> {
		await new Promise(resolve => setTimeout(resolve, 300))

		return {
			id: `sample-${Date.now()}`,
			order: 0,
			clipUrl: "/placeholder.svg?height=100&width=100"
		}
	},

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async revealTrack(_gameId: string): Promise<Track> {
		await new Promise(resolve => setTimeout(resolve, 200))

		const track = mockTracks[Math.floor(Math.random() * mockTracks.length)]
		if (!track) {
			throw new Error("No track left")
		}

		return track
	},

	async finishGame(gameId: string): Promise<Game> {
		await new Promise(resolve => setTimeout(resolve, 200))

		return {
			id: gameId,
			playlist: mockPlaylists[0],
			settings: { samplesCount: 10, sampleDurationMs: 5000 },
			samples: [],
			currentSampleIndex: 10,
			status: "finished",
			startTime: new Date(Date.now() - 300000), // 5 minutes ago
			endTime: new Date()
		}
	}
}
