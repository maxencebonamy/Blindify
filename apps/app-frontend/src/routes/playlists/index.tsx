import { useState, useEffect } from "react"
import { Input } from "#/components/ui/input"
import { Button } from "#/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { Badge } from "#/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { indexUserPlaylistsOptions } from "#/generated/@tanstack/react-query.gen"

export const Route = createFileRoute("/playlists/")({
	component: RouteComponent
})

function RouteComponent() {
	const router = useRouter()
	const navigateToPlaylist = (playlistId: string) => router.navigate({ to: "/playlists/$playlistId", params: { playlistId } })

	const [ nameFilter, setNameFilter ] = useState("")
	const [ debouncedNameFilter, setDebouncedNameFilter ] = useState("")
	const [ page, setPage ] = useState(1)
	const [ limit, setLimit ] = useState(10)

	const { data: playlists } = useQuery(indexUserPlaylistsOptions({
		query: { limit, page, nameFilter }
	}))

	// Debounce the name filter
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedNameFilter(nameFilter)
			setPage(1) // Reset to first page when filtering
		}, 300)

		return () => clearTimeout(timer)
	}, [ nameFilter ])

	const totalPages = playlists?.totalPages ?? 1

	const handlePageChange = (newPage: number) => {
		setPage(Math.max(1, Math.min(newPage, totalPages)))
	}

	const handleLimitChange = (newLimit: string) => {
		setLimit(Number.parseInt(newLimit))
		setPage(1) // Reset to first page when changing page size
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">My Playlists</CardTitle>
					<CardDescription>Manage and browse your music playlists</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Filters and Controls */}
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search playlists..."
								value={nameFilter}
								onChange={e => setNameFilter(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
							<Select value={limit.toString()} onValueChange={handleLimitChange}>
								<SelectTrigger className="w-20">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="20">20</SelectItem>
									<SelectItem value="50">50</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12"></TableHead>
									<TableHead>Name</TableHead>
									<TableHead className="hidden md:table-cell">Description</TableHead>
									<TableHead className="text-right">Tracks</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{playlists?.items?.length === 0
									? (
										<TableRow>
											<TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
												{debouncedNameFilter ? "No playlists found matching your search." : "No playlists found."}
											</TableCell>
										</TableRow>
									)
									: playlists?.items?.map(playlist => (
										<TableRow
											key={playlist.spotifyId}
											className="hover:bg-muted/50"
											onClick={() => navigateToPlaylist(playlist.spotifyId)}
										>
											<TableCell>
												<Avatar className="h-10 w-10 rounded-md">
													<AvatarImage src={playlist.cover || undefined} alt={playlist.name} />
													<AvatarFallback className="text-xs rounded-md">
														{playlist.name.slice(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
											</TableCell>
											<TableCell>
												<div className="font-medium">{playlist.name}</div>
												<div className="text-sm text-muted-foreground md:hidden">
													{playlist.description || "No description"}
												</div>
											</TableCell>
											<TableCell className="hidden md:table-cell">
												<span className="text-muted-foreground">{playlist.description || "No description"}</span>
											</TableCell>
											<TableCell className="text-right">
												<Badge variant="secondary" className="font-mono">
													{playlist.totalTracks}
												</Badge>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between mt-6">
							<div className="text-sm text-muted-foreground">
								Page
								{" "}
								{page}
								{" "}
								of
								{" "}
								{totalPages}
							</div>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
									<ChevronLeft className="h-4 w-4" />
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(page + 1)}
									disabled={page === totalPages}
								>
									Next
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
