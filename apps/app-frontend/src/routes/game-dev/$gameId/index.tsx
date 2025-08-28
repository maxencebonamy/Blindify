import { AudioPlayer } from "#/components/audio-player"
import { Button } from "#/components/button"
import { Icon } from "#/components/icon"
import { RoundIndicator, type RoundIndicatorProps } from "#/components/round-indicator"
import { TimedProgressBar } from "#/components/timed-progress-bar"
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
		sampleDurationMs: 10000
	},
	samples: [
		{
			id: "6f88c1d2-9770-497d-a309-27cc489aa75a",
			order: 0
		},
		{
			id: "5d0fdb64-91a5-420e-8bbd-97af3c4e658d",
			order: 1
		},
		{
			id: "f01dc929-f659-453f-b759-1c521303992e",
			order: 2
		},
		{
			id: "4f283eb0-272f-4f40-b1bc-957d20d9f4cc",
			order: 3
		},
		{
			id: "86b1ea9e-8726-4ad9-ad8f-4a5b5d947b06",
			order: 4
		},
		{
			id: "3b57f329-6350-41af-b820-31e16a359364",
			order: 5
		},
		{
			id: "1985c3fd-05eb-4570-a32f-9c23ff44d9b3",
			order: 6
		},
		{
			id: "1b95f30b-99cb-4b74-8ab5-01441998101f",
			order: 7
		},
		{
			id: "bff5c484-570e-4ec8-9182-f50948fb739b",
			order: 8
		},
		{
			id: "3546a3b1-97ce-4cf2-9ea1-73f6e22ebf56",
			order: 9
		}
	],
	currentSampleIndex: 0,
	status: "listening",
	startTime: null,
	endTime: null,
	nextActionAt: new Date("2025-08-26T18:58:37.002Z"),
	currentSample: "https://cdnt-preview.dzcdn.net/api/1/1/a/2/3/0/a231120d6ca7f3c12403fd08a565d8e9.mp3?hdnea=exp=1756235605~acl=/api/1/1/a/2/3/0/a231120d6ca7f3c12403fd08a565d8e9.mp3*~data=user_id=0,application_id=42~hmac=e141a528ab6d42d63c62deb4ff5b1eb66a478c1baa07cc33be65ca1897bfc64d",
	currentTrack: null
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
