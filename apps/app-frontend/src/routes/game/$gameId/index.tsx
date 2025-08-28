import { AudioPlayer } from "#/components/audio-player"
import { Icon } from "#/components/icon"
import { Button } from "#/components/button"
import { showGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useGameEvents } from "#/hooks/use-game-events"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { HomeIcon, SettingsIcon } from "lucide-react"
import { RoundIndicator } from "#/components/round-indicator"
import { PlaylistIndicator } from "#/components/playlist-indicator"
import { TrackInfo } from "#/components/track-info"
import { TimedProgressBar } from "#/components/timed-progress-bar"
import { WaveformAnimation } from "#/components/waveform-animation"

export const Route = createFileRoute("/game/$gameId/")({
	component: RouteComponent
})

function RouteComponent() {
	const { gameId } = Route.useParams()

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))

	useGameEvents(gameId)

	if (!game) return <></>

	return (
		<div className="h-screen flex flex-col items-center justify-between p-20">
			<div className="w-full grid grid-cols-3 items-center">
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

				<div className="flex gap-1 justify-self-center">
					{game.samples.map((_, index) => (
						<RoundIndicator key={index} state="notStarted" />
					))}
				</div>

				<PlaylistIndicator playlist={game.playlist} className="justify-self-end	" />
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
				durationMs={game.status !== "loading" ? game.settings.sampleDurationMs : 0}
				className="w-full"
			/>
		</div>
	)
}
