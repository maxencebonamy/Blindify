import { AudioPlayer } from "#/components/audio-player"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "#/components/ui/card"
import { WaveformAnimation } from "#/components/waveform-animation"
import { showGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useGameEvents } from "#/hooks/use-game-events"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Music, Volume2 } from "lucide-react"

export const Route = createFileRoute("/game/$gameId/")({
	component: RouteComponent
})

function RouteComponent() {
	const { gameId } = Route.useParams()

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))

	useGameEvents(gameId)

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
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
			<div className="max-w-2xl w-full space-y-6">
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
