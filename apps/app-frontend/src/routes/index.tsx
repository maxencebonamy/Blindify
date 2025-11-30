import { Col } from "#/components/atoms/col"
import { Row } from "#/components/atoms/row"
import { Text } from "#/components/atoms/text"
import { Input } from "#/components/molecules/input"
import { ArtistCard, ArtistCardSkeleton } from "#/components/organisms/artist-card"
import { QueryHandler } from "#/components/organisms/query-handler"
import { TopBar } from "#/components/organisms/top-bar"
import { indexArtistsInfiniteOptions } from "#/generated/@tanstack/react-query.gen"
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
		"min-h-screen items-stretch p-8 sm:p-16 gap-4 sm:gap-8",
		// Appearance
		"bg-background",
		// Interaction
		""
	)

	const [ search, setSearch ] = useQueryState("search", searchParams.search)
	const [ debouncedSearch ] = useDebouncedState(search)

	const { hasNextPage, fetchNextPage, isFetchingNextPage, ...result } = useInfiniteQuery({
		...indexArtistsInfiniteOptions({ query: { search: debouncedSearch } }),
		initialPageParam: 1,
		getNextPageParam: lastPage => lastPage?.nextPage
	})

	const { loadMoreRef } = useInfiniteLoader({ hasNextPage, fetchNextPage })

	const artistsLoader = Array.from({ length: 7 }).map((_, i) => (
		<ArtistCardSkeleton key={i} />
	))

	return (
		<>
			<TopBar />
			<Col className={tailwind}>
				<Row className="max-sm:flex-col gap-4">
					<Text level="heading-1" className="flex-1">Select an artist.</Text>
				</Row>

				<Input
					placeholder="Search for an artist..."
					autoFocus
					className=""
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>

				<div className="w-full grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
					<QueryHandler
						result={result}
						handler={artists => {
							const allArtists = artists.pages.flatMap(e => e.items).filter(e => e !== null)
							if (allArtists.length === 0) {
								return <Text level="paragraph">No artist found...</Text>
							}

							return allArtists.map(artist => (
								<ArtistCard
									key={artist.id}
									artist={artist}
									link={{ to: "/create-game", search: { artistId: artist.id } }}
								/>
							))
						}}
						loader={artistsLoader}
					/>

					{isFetchingNextPage && artistsLoader}
					<span ref={loadMoreRef} />
				</div>
			</Col>
		</>
	)
}
