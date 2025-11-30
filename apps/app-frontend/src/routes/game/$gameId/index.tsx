import { AudioPlayer } from "#/components/organisms/audio-player"
import { Icon } from "#/components/atoms/icon"
import { Button } from "#/components/molecules/button"
import { showGameOptions } from "#/generated/@tanstack/react-query.gen"
import { useGameEvents } from "#/hooks/use-game-events"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { HomeIcon, SettingsIcon } from "lucide-react"
import { RoundIndicator, type RoundIndicatorProps } from "#/components/organisms/round-indicator"
import { TrackInfo } from "#/components/organisms/track-info"
import { TimedProgressBar } from "#/components/organisms/timed-progress-bar"
import { WaveformAnimation } from "#/components/organisms/waveform-animation"
import { useEffect, useState } from "react"
import { LoadingScreen } from "#/components/templates/loading-screen"
import { Loader } from "#/components/atoms/loader"
import { useBreakpoint } from "#/hooks/use-breakpoint"
import { Col } from "#/components/atoms/col"
import { useNavigateBack } from "#/hooks/use-navigate-back"
import { Row } from "#/components/atoms/row"
import { ArtistIndicator } from "#/components/organisms/artist-indicator"

export const Route = createFileRoute("/game/$gameId/")({
	component: RouteComponent
})

function RouteComponent() {
	const breakpoint = useBreakpoint()
	const navigateBack = useNavigateBack()
	const { gameId } = Route.useParams()

	const { data: game } = useQuery(showGameOptions({ path: { gameId } }))

	const [ rounds, setRounds ] = useState<RoundIndicatorProps["state"][]>([])
	const [ playing, setPlaying ] = useState(false)

	useEffect(() => {
		if (!game) return
		if (game.status === "finished") {
			navigateBack()
		}
		if (game.status === "revealing") {
			setPlaying(false)
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
		<div className="h-screen flex flex-col items-center justify-between p-8 sm:p-20">
			<Col className="w-full gap-6">
				<div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-8 items-center">
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

					<Row className="flex-wrap justify-center gap-2 w-80 justify-self-center max-sm:hidden">
						{rounds.map((round, index) => (
							<RoundIndicator key={index} state={round} />
						))}
					</Row>

					<ArtistIndicator artist={game.artist} className="justify-self-end" />
				</div>

				<Row className="flex-wrap justify-center gap-2 w-80 justify-self-center sm:hidden">
					{rounds.map((round, index) => (
						<RoundIndicator key={index} state={round} />
					))}
				</Row>
			</Col>

			{game.currentSample && (
				<AudioPlayer url={game.currentSample} onPlay={() => setPlaying(true)} />
			)}

			{game.currentTrack && (
				<TrackInfo track={game.currentTrack} />
			)}

			{!game.currentTrack && (
				<>
					{playing && (
						<WaveformAnimation barCount={breakpoint === "base" ? 16 : 30} className="h-20" />
					)}
					{!playing && (
						<Loader />
					)}
				</>
			)}

			<TimedProgressBar
				key={game.currentSampleIndex}
				durationMs={game.settings.sampleDurationMs}
				className="w-full"
			/>
		</div>
	)
}
