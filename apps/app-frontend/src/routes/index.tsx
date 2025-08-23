import { Button } from "#/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import { indexUserPlaylistsOptions } from "#/generated/@tanstack/react-query.gen"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { Music, TriangleAlert, Search, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()

	const [ selectedPlaylist, setSelectedPlaylist ] = useState<string | null>(null)
	const [ page, setPage ] = useState(1)
	const [ search, setSearch ] = useState("")

	const { data: playlists, isPending, isError } = useQuery(indexUserPlaylistsOptions({
		query: { limit: 20, page, search }
	}))

	const handlePlayPlaylist = (playlistId: string) => {
		router.navigate({ to: "/create-game", search: { playlistId } })
	}

	const handleGlobalPlay = () => {
		if (selectedPlaylist) {
			handlePlayPlaylist(selectedPlaylist)
		}
	}

	if (isPending) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<Music className="w-8 h-8 text-primary-foreground" />
					</div>
					<p className="text-muted-foreground">Loading your playlists...</p>
				</div>
			</div>
		)
	}

	if (isError || !playlists) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
						<TriangleAlert className="w-8 h-8 text-destructive-foreground" />
					</div>
					<p className="text-muted-foreground">An error occurred when loading your playlists.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-3xl font-bold">Choose Your Playlist</h1>
					<p className="text-muted-foreground">Select a playlist to start your blind test</p>
				</div>

				{/* Search */}
				<div className="max-w-md mx-auto relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder="Search playlists..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Playlists Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{playlists.items.map(playlist => (
						<Card
							key={playlist.id}
							className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
								selectedPlaylist === playlist.id ? "ring-2 ring-primary" : ""
							}`}
							onClick={() => setSelectedPlaylist(playlist.id)}
						>
							<CardHeader className="pb-3">
								<div className="aspect-square relative mb-3 overflow-hidden rounded-lg">
									<img
										src={playlist.coverUrl || "/placeholder.svg?height=300&width=300&query=music playlist"}
										alt={playlist.name}
										className="object-cover"
									/>
								</div>
								<CardTitle className="text-lg">{playlist.name}</CardTitle>
								{playlist.description && <CardDescription className="text-sm">{playlist.description}</CardDescription>}
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										{playlist.trackCount}
										{" "}
										tracks
									</span>
									<Button
										size="sm"
										onClick={e => {
											e.stopPropagation()
											handlePlayPlaylist(playlist.id)
										}}
										className="gap-2"
									>
										<Play className="w-4 h-4" />
										Play
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Pagination */}
				{playlists.totalPages > 1 && (
					<div className="flex items-center justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => setPage(p => Math.max(1, p - 1))}
							disabled={page === 1}
						>
							<ChevronLeft className="w-4 h-4" />
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">
							Page
							{" "}
							{page}
							{" "}
							of
							{playlists.totalPages}
						</span>
						<Button
							variant="outline"
							onClick={() => setPage(p => Math.min(playlists.totalPages, p + 1))}
							disabled={page === playlists.totalPages}
						>
							Next
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
				)}

				{/* Global Play Button */}
				{selectedPlaylist && (
					<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
						<Button size="lg" onClick={handleGlobalPlay} className="gap-2 pulse-glow">
							<Play className="w-5 h-5" />
							Play Selected Playlist
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
