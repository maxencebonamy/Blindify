import { AudioPlayer } from "#/components/audio-player"
import { ProgressBar } from "#/components/progress-bar"
import { Badge } from "#/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "#/components/ui/card"
import { WaveformAnimation } from "#/components/waveform-animation"
import { showGameOptions, showSampleGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Music, Volume2 } from "lucide-react"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/game/$gameId/listening/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()
	const { gameId } = Route.useParams()

	const [ progress, setProgress ] = useState(0)
	const [ isPlaying, setIsPlaying ] = useState(false)

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))
	const { data: sample } = useQuery(showSampleGameOptions({ path: { gameId } }))

	// const isPending = gameQuery.isPending || sampleQuery.isPending
	// const isError = gameQuery.isError || sampleQuery.isError

	useEffect(() => {
		if (sample && game) {
			startPlayback()
		}
	}, [ sample, game ])

	const startPlayback = () => {
		if (!game) return

		setIsPlaying(true)
		setProgress(0)

		const duration = game.settings.sampleDurationMs
		const interval = 100 // Update every 100ms
		let elapsed = 0

		const progressInterval = setInterval(() => {
			elapsed += interval
			const newProgress = (elapsed / duration) * 100

			if (newProgress >= 100) {
				clearInterval(progressInterval)
				setIsPlaying(false)
				setProgress(100)
				// Auto-navigate to reveal after sample ends
				setTimeout(() => {
					router.navigate({ to: "/game/$gameId/reveal", params: { gameId } })
				}, 500)
			} else {
				setProgress(newProgress)
			}
		}, interval)
	}

	if (!game || !sample) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<Music className="w-8 h-8 text-primary-foreground" />
					</div>
					<p className="text-muted-foreground">Loading sample...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
			<div className="max-w-2xl w-full space-y-6">
				{/* Game Progress */}
				<div className="text-center space-y-2">
					<Badge variant="secondary" className="text-lg px-4 py-2">
						Sample
						{" "}
						{game.currentSampleIndex + 1}
						{" "}
						of
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
							<WaveformAnimation isPlaying={isPlaying} className="h-20" />
						</div>

						<AudioPlayer url={sample.clipUrl} />

						{/* Progress Bar */}
						<ProgressBar progress={progress} duration={game.settings.sampleDurationMs} />

						{/* Playback Status */}
						<div className="text-center">
							{isPlaying
								? (
									<p className="text-primary font-medium">🎵 Playing sample...</p>
								)
								: progress === 100
									? (
										<p className="text-muted-foreground">Sample complete! Revealing answer...</p>
									)
									: (
										<p className="text-muted-foreground">Preparing to play...</p>
									)}
						</div>
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
