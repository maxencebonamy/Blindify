import { Col } from "#/components/atoms/col"
import { Row } from "#/components/atoms/row"
import { Text } from "#/components/atoms/text"
import { Input } from "#/components/molecules/input"
import { PlaylistCard, PlaylistCardSkeleton } from "#/components/organisms/playlist-card"
import { QueryHandler } from "#/components/organisms/query-handler"
import { TopBar } from "#/components/organisms/top-bar"
import { indexPlaylistsInfiniteOptions } from "#/generated/@tanstack/react-query.gen"
import { useDebouncedState } from "#/hooks/use-debounced-state"
import { useInfiniteLoader } from "#/hooks/use-infinite-loader"
import { cn } from "#/utils/tailwind.util"
import { useInfiniteQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { createStandardSchemaV1, parseAsString, useQueryState } from "nuqs"

const searchParams = {
	search: parseAsString.withDefault("")
}

export const Route = createFileRoute("/")({
	component: RouteComponent,
	validateSearch: createStandardSchemaV1(searchParams, {
		partialOutput: true
	})
})

function RouteComponent() {
	const tailwind = cn(
		// Layout
		"min-h-screen items-stretch p-16 gap-8",
		// Appearance
		"bg-background",
		// Interaction
		""
	)

	const [ search, setSearch ] = useQueryState("search", searchParams.search)
	const [ debouncedSearch ] = useDebouncedState(search)

	const { hasNextPage, fetchNextPage, isFetchingNextPage, ...result } = useInfiniteQuery({
		...indexPlaylistsInfiniteOptions({ query: { search: debouncedSearch } }),
		initialPageParam: 1,
		getNextPageParam: lastPage => lastPage?.nextPage,
		enabled: search !== ""
	})

	const { loadMoreRef } = useInfiniteLoader({ hasNextPage, fetchNextPage })

	const playlistsLoader = Array.from({ length: 7 }).map((_, i) => (
		<PlaylistCardSkeleton key={i} />
	))

	return (
		<>
			<TopBar />
			<Col className={tailwind}>
				<Row className="max-sm:flex-col gap-4">
					<Text level="heading-1" className="flex-1">Select a playlist.</Text>
				</Row>

				<Input
					placeholder="Search for a playlist..."
					autoFocus
					className=""
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>

				{ search === "" && (
					<Text level="paragraph">Start typing keywords to search playlists...</Text>
				) }

				<div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
					{ search !== "" && (
						<QueryHandler
							result={result}
							handler={playlists => {
								const allPlaylists = playlists.pages.flatMap(e => e.items).filter(e => e !== null)
								if (allPlaylists.length === 0) {
									return <Text level="paragraph">No playlist found...</Text>
								}

								return allPlaylists.map(playlist => (
									<PlaylistCard
										key={playlist.id}
										playlist={playlist}
										link={{ to: "/create-game", search: { playlistId: playlist.id } }}
									/>
								))
							}}
							loader={playlistsLoader}
						/>
					) }

					{isFetchingNextPage && playlistsLoader}
					<span ref={loadMoreRef} />
				</div>
			</Col>
		</>
	)
}
