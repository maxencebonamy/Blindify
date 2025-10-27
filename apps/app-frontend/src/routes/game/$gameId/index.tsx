import { AudioPlayer } from "#/components/organisms/audio-player"
import { Icon } from "#/components/atoms/icon"
import { Button } from "#/components/molecules/button"
import { showGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useGameEvents } from "#/hooks/use-game-events"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { HomeIcon, SettingsIcon } from "lucide-react"
import { RoundIndicator, type RoundIndicatorProps } from "#/components/organisms/round-indicator"
import { PlaylistIndicator } from "#/components/organisms/playlist-indicator"
import { TrackInfo } from "#/components/organisms/track-info"
import { TimedProgressBar } from "#/components/organisms/timed-progress-bar"
import { WaveformAnimation } from "#/components/organisms/waveform-animation"
import { useEffect, useState } from "react"
import { LoadingScreen } from "#/components/templates/loading-screen"

export const Route = createFileRoute("/game/$gameId/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()
	const { gameId } = Route.useParams()

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))

	const [ rounds, setRounds ] = useState<RoundIndicatorProps["state"][]>([])

	useEffect(() => {
		if (!game) return
		if (game.status === "finished") {
			router.navigate({ to: "/create-game", search: { playlistId: game.playlist.id } })
		}
		setRounds(game.samples.map((_, index) => {
			if (index < game.currentSampleIndex) return "done"
			if (index > game.currentSampleIndex) return "notStarted"
			if (game.status === "listening") return "inProgress"
			return "done"
		}))
	}, [ game ])

	useGameEvents({ gameId })

	if (!game) return <></>

	if (game.status === "loading") {
		return <LoadingScreen />
	}

	return (
		<div className="h-screen flex flex-col items-center justify-between p-20">
			<div className="w-full grid grid-cols-3 gap-8 items-center">
				<div className="flex gap-4">
					<Link to="/">
						<Button size="icon">
							<Icon icon={HomeIcon} />
						</Button>
					</Link>
					<Button size="icon" variant="outline">
						<Icon icon={SettingsIcon} />
					</Button>
				</div>

				<div className="grid grid-cols-10 gap-2 justify-self-center">
					{rounds.map((round, index) => (
						<RoundIndicator key={index} state={round} />
					))}
				</div>

				<PlaylistIndicator playlist={game.playlist} className="justify-self-end" />
			</div>

			{game.currentSample && <AudioPlayer url={game.currentSample} />}

			{game.currentTrack && (
				<TrackInfo track={game.currentTrack} />
			)}

			{!game.currentTrack && (
				<WaveformAnimation barCount={30} className="h-20" />
			)}

			<TimedProgressBar
				key={game.currentSampleIndex}
				durationMs={game.settings.sampleDurationMs}
				className="w-full"
			/>
		</div>
	)
}
