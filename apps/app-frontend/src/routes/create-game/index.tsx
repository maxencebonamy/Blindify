import { Button } from "#/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#/components/ui/card"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Music, Clock, Play, HashIcon } from "lucide-react"
import { useState } from "react"
import z from "zod"
import { zodValidator } from "@tanstack/zod-adapter"
import { Badge } from "#/components/ui/badge"
import { showUserPlaylistOptions, storeGameMutation } from "#/generated/@tanstack/react-query.gen"
import { useMutation, useQuery } from "@tanstack/react-query"
import type { GameSettings } from "#/generated"

export const Route = createFileRoute("/create-game/")({
	component: RouteComponent,
	validateSearch: zodValidator(z.object({
		playlistId: z.string()
	}))
})

function RouteComponent() {
	const router = useRouter()
	const { playlistId } = Route.useSearch()

	const [ settings, setSettings ] = useState<GameSettings>({
		sampleCount: 10,
		sampleDurationMs: 5000
	})

	const { data: playlist, isPending, isError } = useQuery(showUserPlaylistOptions({
		path: { playlistId }
	}))

	const { mutate: createGame, isPending: isCreateGamePending } = useMutation({
		...storeGameMutation(),
		onSuccess: game => {
			router.navigate({ to: "/game/$gameId", params: { gameId: game.id } })
		}
	})

	const sampleOptions = [ 10, 20, 30 ] as const
	const durationOptions = [
		{ value: 2000, label: "2s" },
		{ value: 5000, label: "5s" },
		{ value: 10000, label: "10s" },
		{ value: 20000, label: "20s" }
	] as const

	if (isPending || isError || !playlist) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<Music className="w-8 h-8 text-primary-foreground" />
					</div>
					<p className="text-muted-foreground"> Loading playlist... </p>
				</div>
			</div>
		)
	}

	if (isError || !playlist) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<Card className="max-w-md">
					<CardHeader>
						<CardTitle>Playlist Not Found</CardTitle>
						<CardDescription>The selected playlist could not be loaded.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.navigate({ to: "/" })} className="w-full">
							Back to Playlists
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-3xl font-bold">Create Your Game</h1>
					<p className="text-muted-foreground">Configure your blind test settings</p>
				</div>

				{/* Selected Playlist */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Music className="w-5 h-5" />
							Selected Playlist
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 relative rounded-lg overflow-hidden">
								<img
									src={playlist.coverUrl || "/placeholder.svg?height=64&width=64&query=music playlist"}
									alt={playlist.name}
									className="object-cover"
								/>
							</div>
							<div className="flex-1">
								<h3 className="font-semibold">{playlist.name}</h3>
								{playlist.description && <p className="text-sm text-muted-foreground">{playlist.description}</p>}
								<p className="text-sm text-muted-foreground mt-1">
									{playlist.trackCount}
									{" "}
									tracks
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Game Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<HashIcon className="w-5 h-5" />
							Number of Samples
						</CardTitle>
						<CardDescription>How many songs to include in your game</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex gap-3">
							{sampleOptions.map(count => (
								<Button
									key={count}
									variant={settings.sampleCount === count ? "default" : "outline"}
									onClick={() => setSettings(s => ({ ...s, sampleCount: count }))}
									className="flex-1"
								>
									{count}
									{" "}
									songs
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="w-5 h-5" />
							Sample Duration
						</CardTitle>
						<CardDescription>How long each sample should play</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-3">
							{durationOptions.map(option => (
								<Button
									key={option.value}
									variant={settings.sampleDurationMs === option.value ? "default" : "outline"}
									onClick={() => setSettings(s => ({ ...s, sampleDurationMs: option.value }))}
								>
									{option.label}
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Game Summary */}
				<Card className="bg-muted/50">
					<CardHeader>
						<CardTitle>Game Summary</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between items-center">
							<span>Playlist:</span>
							<Badge variant="secondary">{playlist.name}</Badge>
						</div>
						<div className="flex justify-between items-center">
							<span>Samples:</span>
							<Badge variant="secondary">
								{settings.sampleCount}
								{" "}
								songs
							</Badge>
						</div>
						<div className="flex justify-between items-center">
							<span>Duration per sample:</span>
							<Badge variant="secondary">
								{settings.sampleDurationMs / 1000}
								s
							</Badge>
						</div>
						<div className="flex justify-between items-center">
							<span>Estimated total time:</span>
							<Badge variant="secondary">
								~
								{Math.round((settings.sampleCount * (settings.sampleDurationMs + 10000)) / 60000)}
								{" "}
								minutes
							</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Start Game Button */}
				<Button
					onClick={() => createGame({ body: { playlistId, settings } })}
					disabled={isCreateGamePending}
					size="lg"
					className="w-full gap-2 pulse-glow"
				>
					<Play className="w-5 h-5" />
					{isCreateGamePending ? "Creating Game..." : "Start Game"}
				</Button>
			</div>
		</div>
	)
}
