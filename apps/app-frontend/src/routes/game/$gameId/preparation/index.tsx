import { Card, CardContent } from "#/components/ui/card"
import { showGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { MinusIcon, MusicIcon } from "lucide-react"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/game/$gameId/preparation/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()
	const { gameId } = Route.useParams()

	const [ countdown, setCountdown ] = useState<number | null>(null)

	const { data: game, isPending } = useQuery({
		...showGameOptions({
			path: { gameId }
		}),
		retry: 60,
		retryDelay: 2000
	})

	useEffect(() => {
		if (!game) return
		startCountdown()
	}, [ isPending ])

	const startCountdown = () => {
		setCountdown(3)

		const countdownInterval = setInterval(() => {
			setCountdown(prev => {
				if (prev === null || prev <= 1) {
					clearInterval(countdownInterval)
					router.navigate({ to: "/game/$gameId/listening", params: { gameId } })
					return null
				}
				return prev - 1
			})
		}, 1000)
	}

	if (!game) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<Card className="max-w-md">
					<CardContent className="p-8 text-center space-y-4">
						<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
							<MusicIcon className="w-8 h-8 text-primary-foreground" />
						</div>
						<h2 className="text-xl font-semibold">Preparing Your Game</h2>
						<p className="text-muted-foreground">
							We're setting up your blind test with the best tracks from your playlist...
						</p>
						<div className="flex justify-center gap-1">
							{[ 0, 1, 2 ].map(i => (
								<div
									key={i}
									className="w-2 h-2 bg-primary rounded-full animate-pulse"
									style={{ animationDelay: `${i * 0.2}s` }}
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (countdown !== null) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<Card className="max-w-md">
					<CardContent className="p-8 text-center space-y-6">
						<h2 className="text-xl font-semibold">Get Ready!</h2>
						<div className="text-8xl font-bold text-primary animate-pulse">{countdown}</div>
						<p className="text-muted-foreground">Your blind test is about to begin...</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
			<Card className="max-w-md">
				<CardContent className="p-8 text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
						<MinusIcon className="w-8 h-8 text-primary-foreground" />
					</div>
					<h2 className="text-xl font-semibold">Game Ready!</h2>
					<p className="text-muted-foreground">Starting your blind test now...</p>
				</CardContent>
			</Card>
		</div>
	)
}
