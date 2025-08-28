import { AudioPlayer } from "#/components/audio-player"
import { Button } from "#/components/button"
import { Icon } from "#/components/icon"
import { PlaylistIndicator } from "#/components/playlist-indicator"
import { RoundIndicator, type RoundIndicatorProps } from "#/components/round-indicator"
import { TimedProgressBar } from "#/components/timed-progress-bar"
import { TrackInfo } from "#/components/track-info"
import { Badge } from "#/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "#/components/ui/card"
import { WaveformAnimation } from "#/components/waveform-animation"
import type { Game } from "#/generated"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Music, PlayIcon, Volume2 } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/game-dev/$gameId/")({
	component: RouteComponent
})

const mockGame = (id: string): Game => ({
	id,
	playlist: {
		id: "5NNCSqqb0IXiwKP7b1nRlv",
		name: "106.1 FM",
		description: "",
		coverUrl: "https://mosaic.scdn.co/640/ab67616d00001e023435cdb5b976c6364eb891b8ab67616d00001e026421924f3ad8bcb91b14889eab67616d00001e02999c81ce1ebf4260ecad31c0ab67616d00001e02bf4a3c813df32e71480b66f4",
		trackCount: 389
	},
	settings: {
		sampleCount: 10,
		sampleDurationMs: 5000
	},
	samples: [
		{
			id: "7dcb6978-cb34-4112-a63d-f4f91c90aea7",
			order: 0
		},
		{
			id: "4c1af51b-8d5c-4d25-89cb-fa3c7f6e6ece",
			order: 1
		},
		{
			id: "4b6ff22a-e037-4d60-ae86-f281439e297d",
			order: 2
		},
		{
			id: "76537c29-0f78-449f-890d-232cc924281c",
			order: 3
		},
		{
			id: "ce71c5c7-4843-4ac5-bf35-62226d4a6a3f",
			order: 4
		},
		{
			id: "2ff32bc0-8047-4ef4-bad6-ccbc8941fd95",
			order: 5
		},
		{
			id: "ae72fc88-e2e2-4039-b570-d5fe10979642",
			order: 6
		},
		{
			id: "b2d92bd3-d125-4748-b7ba-a4286f0cc36d",
			order: 7
		},
		{
			id: "60eb3ee7-bad9-4dc5-87cf-fe16323e0f4d",
			order: 8
		},
		{
			id: "828b05d0-17f7-4143-bb34-6f8f41d47ec7",
			order: 9
		}
	],
	currentSampleIndex: 0,
	status: "revealing",
	startTime: null,
	endTime: null,
	nextActionAt: new Date("2025-08-28T18:11:26.002Z"),
	currentSample: "https://cdnt-preview.dzcdn.net/api/1/1/e/5/2/0/e5257cfc404a7540c48f2089382d0a1f.mp3?hdnea=exp=1756405566~acl=/api/1/1/e/5/2/0/e5257cfc404a7540c48f2089382d0a1f.mp3*~data=user_id=0,application_id=42~hmac=cd89d13d63464dfebf0d1a958dcf41b97fb7a3a29298054b10eb848c4e6d19ca",
	currentTrack: {
		id: "30tS3If78Ki201I38CoP68",
		title: "Au paradis",
		artists: [
			"De Palmas"
		],
		album: "Sur Ma Route",
		coverUrl: "https://i.scdn.co/image/ab67616d0000b2735070ecfecc35e17290552733"
	}
})

function RouteComponent() {
	const { gameId } = Route.useParams()
	const game = mockGame(gameId)

	const [ rounds, setRounds ] = useState<RoundIndicatorProps["state"][]>([
		"done", "done", "done", "done", "done", "inProgress", "notStarted", "notStarted", "notStarted", "notStarted"
	])

	const nextRound = () => setRounds(r => {
		const inProgressIndex = r.indexOf("inProgress")
		if (inProgressIndex !== -1) {
			return [ ...r.slice(0, inProgressIndex), "done", ...r.slice(inProgressIndex + 1) ]
		}
		const notStartedIndex = r.indexOf("notStarted")
		if (notStartedIndex !== -1) {
			return [ ...r.slice(0, notStartedIndex), "inProgress", ...r.slice(notStartedIndex + 1) ]
		}
		return r
	})

	// const { data: game } = useQuery(showGameOptions({ path: { gameId } }))
	// useGameEvents(gameId)

	if (!game) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<Music className="w-8 h-8 text-primary-foreground" />
					</div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-2xl w-full space-y-6">
				<PlaylistIndicator playlist={game.playlist} />
				{game.currentTrack && <TrackInfo track={game.currentTrack} />}
				<TimedProgressBar className="w-full" variant="secondary" durationMs={10000} />
				<div className="grid grid-cols-10 gap-2 w-fit">
					{rounds.map(state => (
						<RoundIndicator state={state} />
					))}
				</div>
				<div className="grid grid-cols-4 w-full gap-4">
					<Button variant="primary" onClick={nextRound}>
						Continue
					</Button>
					<Button variant="secondary">
						Continue
					</Button>
					<Button variant="outline">
						Continue
					</Button>
					<Button variant="destructive">
						Continue
					</Button>
					<Button variant="primary">
						<Icon icon={PlayIcon} />
						Continue
					</Button>
					<Button variant="secondary">
						<Icon icon={PlayIcon} />
						Continue
					</Button>
					<Button variant="outline">
						<Icon icon={PlayIcon} />
						Continue
					</Button>
					<Button variant="destructive">
						<Icon icon={PlayIcon} />
						Continue
					</Button>
					<Button variant="primary" size="icon">
						<Icon icon={PlayIcon} />
					</Button>
					<Button variant="secondary" size="icon">
						<Icon icon={PlayIcon} />
					</Button>
					<Button variant="outline" size="icon">
						<Icon icon={PlayIcon} />
					</Button>
					<Button variant="destructive" size="icon">
						<Icon icon={PlayIcon} />
					</Button>
				</div>
				<Link to="/">
					<Button>
						Home
					</Button>
				</Link>

				{/* Game Progress */}
				<div className="text-center space-y-2">
					<Badge variant="secondary" className="text-lg px-4 py-2">
						Sample
						{" "}
						{game.currentSampleIndex + 1}
						{" "}
						of
						{" "}
						{game.samples.length}
					</Badge>
					<h1 className="text-2xl font-bold">Listen Carefully!</h1>
					<p className="text-muted-foreground">Can you guess this song?</p>
				</div>

				{/* Main Listening Card */}
				<Card className="bg-card/80 backdrop-blur">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Volume2 className="w-6 h-6" />
							Now Playing
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Waveform Animation */}
						<div className="flex justify-center">
							<WaveformAnimation isPlaying={true} className="h-20" />
						</div>

						{game.currentSample && <AudioPlayer url={game.currentSample} />}

						{game.currentTrack && (
							<div className="text-center space-y-4 transition-all duration-1000">
								<div className="w-48 h-48 mx-auto relative rounded-lg overflow-hidden">
									<img
										src={game.currentTrack.coverUrl || "/placeholder.svg?height=300&width=300&query=music album cover"}
										alt={`${game.currentTrack.title} by ${game.currentTrack.artists.join(", ")}`}
										className="object-cover"
									/>
								</div>

								<div className="space-y-2">
									<h2 className="text-2xl font-bold">{game.currentTrack.title}</h2>
									<p className="text-lg text-muted-foreground">
										by
										{" "}
										{game.currentTrack.artists.join(", ")}
									</p>
									<p className="text-sm text-muted-foreground">{game.currentTrack.album}</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Playlist Info */}
				<Card className="bg-muted/50">
					<CardContent className="p-4">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">From playlist:</span>
							<span className="font-medium">{game.playlist.name}</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
