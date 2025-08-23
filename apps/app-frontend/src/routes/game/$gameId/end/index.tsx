"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { Badge } from "#/components/ui/badge"
import { Music, RotateCcw, List, Trophy } from "lucide-react"
import { ConfettiEffect } from "#/components/confetti-effect"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { showGameOptions } from "#/generated/@tanstack/react-query.gen"

export const Route = createFileRoute("/game/$gameId/end/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()
	const { gameId } = Route.useParams()

	const [ showConfetti, setShowConfetti ] = useState(false)

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))

	useEffect(() => {
		if (game) {
			// Show confetti animation
			setShowConfetti(true)
			setTimeout(() => setShowConfetti(false), 4000)
		}
	}, [ game ])

	const handleReplay = () => {
		router.navigate({ to: "/create-game", search: { playlistId: game?.playlist.id ?? "" } })
	}

	const handleBackToPlaylists = () => {
		router.navigate({ to: "/playlists" })
	}

	const calculateDuration = () => {
		if (!game?.startTime || !game?.endTime) return 0
		return Math.round((game.endTime.getTime() - game.startTime.getTime()) / 60000)
	}

	if (!game) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<Music className="w-8 h-8 text-primary-foreground" />
					</div>
					<p className="text-muted-foreground">Loading results...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
			<ConfettiEffect isActive={showConfetti} />

			<div className="max-w-2xl w-full space-y-6">
				{/* Celebration Header */}
				<div className="text-center space-y-4">
					<div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto pulse-glow">
						<Trophy className="w-10 h-10 text-primary-foreground" />
					</div>
					<h1 className="text-3xl font-bold">Game Complete! 🎉</h1>
					<p className="text-muted-foreground">Great job! You've completed your blind test challenge.</p>
				</div>

				{/* Game Summary */}
				<Card className="bg-card/80 backdrop-blur">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Music className="w-5 h-5" />
							Game Summary
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Playlist Info */}
						<div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
							<div className="w-16 h-16 relative rounded-lg overflow-hidden">
								<img
									src={game.playlist.coverUrl || "/placeholder.svg?height=64&width=64&query=music playlist"}
									alt={game.playlist.name}
									className="object-cover"
								/>
							</div>
							<div className="flex-1">
								<h3 className="font-semibold">{game.playlist.name}</h3>
								{game.playlist.description && (
									<p className="text-sm text-muted-foreground">{game.playlist.description}</p>
								)}
							</div>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center p-4 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">{game.settings.sampleCount}</div>
								<div className="text-sm text-muted-foreground">Samples Played</div>
							</div>

							<div className="text-center p-4 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">{calculateDuration()}</div>
								<div className="text-sm text-muted-foreground">Minutes Played</div>
							</div>

							<div className="text-center p-4 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">
									{game.settings.sampleDurationMs / 1000}
									s
								</div>
								<div className="text-sm text-muted-foreground">Per Sample</div>
							</div>

							<div className="text-center p-4 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">{game.playlist.trackCount}</div>
								<div className="text-sm text-muted-foreground">Total Tracks</div>
							</div>
						</div>

						{/* Achievement Badge */}
						<div className="text-center">
							<Badge variant="secondary" className="text-lg px-6 py-3">
								🎵 Music Explorer Achievement Unlocked!
							</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4">
					<Button onClick={handleReplay} size="lg" className="flex-1 gap-2">
						<RotateCcw className="w-5 h-5" />
						Play Again
					</Button>

					<Button onClick={handleBackToPlaylists} variant="outline" size="lg" className="flex-1 gap-2 bg-transparent">
						<List className="w-5 h-5" />
						Choose New Playlist
					</Button>
				</div>

				{/* Fun Message */}
				<Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
					<CardContent className="p-6 text-center">
						<p className="text-sm text-muted-foreground">
							Thanks for playing! Share this experience with friends and discover new music together. 🎶
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
