import { AudioPlayer } from "#/components/audio-player"
import { ProgressBar } from "#/components/progress-bar"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "#/components/ui/card"
import { nextSampleGameMutation, showGameOptions, showSampleGameOptions, showTrackGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Music, ArrowRight, Play } from "lucide-react"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/game/$gameId/reveal/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()
	const { gameId } = Route.useParams()

	const [ progress, setProgress ] = useState(0)
	const [ isPlaying, setIsPlaying ] = useState(false)
	const [ revealed, setRevealed ] = useState(false)

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))
	const { data: sample } = useQuery(showSampleGameOptions({ path: { gameId } }))
	const { data: track } = useQuery(showTrackGameOptions({ path: { gameId } }))

	const [ hasNext, setHasNext ] = useState(false)
	const { mutate: nextSample } = useMutation({
		...nextSampleGameMutation(),
		retry: 10,
		retryDelay: 200,
		onSuccess: () => {
			if (!game) return
			const isLastSample = game.currentSampleIndex >= game.samples.length - 1

			if (isLastSample) {
				router.navigate({ to: "/game/$gameId/end", params: { gameId } })
			} else {
				router.navigate({ to: "/game/$gameId/listening", params: { gameId } })
			}
		}
	})

	useEffect(() => {
		if (track && game) {
			startRevealSequence()
		}
	}, [ track, game ])

	const startRevealSequence = () => {
		// Start with blur effect, then reveal after 1 second
		setTimeout(() => {
			setRevealed(true)
			startExtendedPlayback()
		}, 1000)
	}

	const startExtendedPlayback = () => {
		setIsPlaying(true)
		setProgress(0)

		const duration = 10000 // 10 seconds extended play
		const interval = 100
		let elapsed = 0

		const progressInterval = setInterval(() => {
			elapsed += interval
			const newProgress = (elapsed / duration) * 100

			if (newProgress >= 100) {
				clearInterval(progressInterval)
				setIsPlaying(false)
				setProgress(100)
				// handleNextStep()
			} else {
				setProgress(newProgress)
			}
		}, interval)
	}

	const handleNextStep = () => {
		if (!game || hasNext) return

		setHasNext(true)
		nextSample({ path: { gameId } })
	}

	const handleSkip = () => {
		handleNextStep()
	}

	if (!game || !track || !sample) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<Music className="w-8 h-8 text-primary-foreground" />
					</div>
					<p className="text-muted-foreground">Revealing track...</p>
				</div>
			</div>
		)
	}

	const isLastSample = game.currentSampleIndex >= game.samples.length - 1

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
					<h1 className="text-2xl font-bold">The Answer Is...</h1>
				</div>

				{/* Track Reveal Card */}
				<Card className="bg-card/80 backdrop-blur">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Music className="w-6 h-6" />
							Track Revealed
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<AudioPlayer url={sample.clipUrl} startTime={game.settings.sampleDurationMs} />
						{/* Album Cover and Track Info */}
						<div
							className={`text-center space-y-4 transition-all duration-1000 ${
								revealed ? "blur-none opacity-100" : "blur-lg opacity-50"
							}`}
						>
							<div className="w-48 h-48 mx-auto relative rounded-lg overflow-hidden">
								<img
									src={track.coverUrl || "/placeholder.svg?height=300&width=300&query=music album cover"}
									alt={`${track.title} by ${track.artists.join(", ")}`}
									className="object-cover"
								/>
							</div>

							<div className="space-y-2">
								<h2 className="text-2xl font-bold">{track.title}</h2>
								<p className="text-lg text-muted-foreground">
									by
									{track.artists.join(", ")}
								</p>
								<p className="text-sm text-muted-foreground">{track.album}</p>
							</div>
						</div>

						{/* Extended Playback Progress */}
						{revealed && (
							<div className="space-y-4">
								<div className="text-center">
									<p className="text-sm text-muted-foreground mb-2">
										{isPlaying ? "Playing extended preview..." : "Extended preview complete"}
									</p>
								</div>

								<ProgressBar progress={progress} duration={10000} />
							</div>
						)}
					</CardContent>
				</Card>

				{/* Action Buttons */}
				{revealed && (
					<div className="flex gap-4 justify-center">
						{isPlaying && (
							<Button variant="outline" onClick={handleSkip}>
								Skip Preview
							</Button>
						)}

						{!isPlaying && (
							<Button onClick={handleNextStep} size="lg" className="gap-2">
								{isLastSample
									? (
										<>
											View Results
											<ArrowRight className="w-4 h-4" />
										</>
									)
									: (
										<>
											Next Sample
											<Play className="w-4 h-4" />
										</>
									)}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
