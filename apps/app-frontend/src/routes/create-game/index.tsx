import { Button } from "#/components/molecules/button"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { ChevronLeftIcon, PlayIcon } from "lucide-react"
import { useEffect, useState } from "react"
import z from "zod"
import { zodValidator } from "@tanstack/zod-adapter"
import { showPlaylistOptions, storeGameMutation } from "#/generated/@tanstack/react-query.gen"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { GameSettings } from "#/generated"
import { Icon } from "#/components/atoms/icon"
import { cn } from "#/utils/tailwind.util"
import { Col } from "#/components/atoms/col"
import { TopBar } from "#/components/organisms/top-bar"
import { Text } from "#/components/atoms/text"
import { PlaylistCard, PlaylistCardSkeleton } from "#/components/organisms/playlist-card"
import { QueryHandler } from "#/components/organisms/query-handler"
import { Row } from "#/components/atoms/row"
import { Card } from "#/components/molecules/card"
import { useBreakpoint } from "#/hooks/use-breakpoint"
import { useNavigateBack } from "#/hooks/use-navigate-back"

export const Route = createFileRoute("/create-game/")({
	component: RouteComponent,
	validateSearch: zodValidator(z.object({
		playlistId: z.string()
	}))
})

function RouteComponent() {
	const tailwind = cn(
		// Layout
		"min-h-screen items-stretch p-8 sm:p-16 gap-4 sm:gap-8",
		// Appearance
		"bg-background",
		// Interaction
		""
	)

	const breakpoint = useBreakpoint()
	const router = useRouter()
	const navigateBack = useNavigateBack()
	const { playlistId } = Route.useSearch()

	const [ settings, setSettings ] = useState<GameSettings>({
		sampleCount: 10,
		sampleDurationMs: 10000
	})

	const playlistQuery = useQuery(showPlaylistOptions({
		path: { playlistId }
	}))

	useEffect(() => {
		if (playlistQuery.error) {
			router.navigate({ to: "/" })
		}
	}, [ playlistQuery.error ])

	const { mutate: createGame, isPending: isCreateGamePending } = useMutation({
		...storeGameMutation(),
		onSuccess: game => {
			router.navigate({ to: "/game/$gameId", params: { gameId: game.id } })
		}
	})

	const sampleOptions = [ 10, 20, 30 ] as const
	const durationOptions = [
		{ value: 10000, label: "10s" },
		{ value: 20000, label: "20s" }
	] as const

	return (
		<>
			<TopBar
				left={(
					<Button
						variant="outline"
						size={breakpoint === "base" ? "icon" : "default"}
						className="justify-self-start"
						onClick={() => navigateBack()}
					>
						<Icon icon={ChevronLeftIcon} />
						<span className="max-sm:hidden">
							Back
						</span>
					</Button>
				)}
			/>

			<Col className={tailwind}>
				<Text level="heading-1">Create a game.</Text>

				<Row className="w-full gap-4 items-stretch max-sm:flex-col">
					<QueryHandler
						result={playlistQuery}
						handler={playlist => (<PlaylistCard playlist={playlist} className="sm:w-64" />)}
						loader={<PlaylistCardSkeleton className="sm:w-64" />}
					/>

					<Col className="flex-1 gap-6">
						<Card className="w-full p-6 gap-4 flex-1">
							<Text level="heading-3">Number of samples</Text>
							<Row className="gap-4 w-full">
								{sampleOptions.map(count => (
									<Button
										key={count}
										variant={settings.sampleCount === count ? "secondary" : "outline"}
										onClick={() => setSettings(s => ({ ...s, sampleCount: count }))}
										className="flex-1"
									>
										{count}
									</Button>
								))}
							</Row>
						</Card>
						<Card className="w-full p-6 gap-4 flex-1">
							<Text level="heading-3">Duration of samples</Text>
							<Row className="gap-4 w-full">
								{durationOptions.map(option => (
									<Button
										key={option.value}
										variant={settings.sampleDurationMs === option.value ? "secondary" : "outline"}
										onClick={() => setSettings(s => ({ ...s, sampleDurationMs: option.value }))}
										className="flex-1"
									>
										{option.label}
									</Button>
								))}
							</Row>
						</Card>
					</Col>
				</Row>

				<Text level="paragraph" className="text-center">
					Estimated total time:
					{" "}
					<span className="font-bold">
						~
						{Math.round((settings.sampleCount * (settings.sampleDurationMs + 10000)) / 60000)}
						{" "}
						minutes
					</span>
				</Text>

				<Button
					onClick={() => createGame({ body: { playlistId, settings } })}
					loading={isCreateGamePending}
					disabled={!playlistQuery.isSuccess}
				>
					<Icon icon={PlayIcon} />
					Start
				</Button>
			</Col>
		</>
	)
}
