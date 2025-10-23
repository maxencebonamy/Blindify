import { useEffect, useRef, type Ref } from "react"

export type UseInfiniteLoaderProps = {
	hasNextPage: boolean | undefined
	fetchNextPage: () => void
}

export type UseInfiniteLoaderReturn = {
	loadMoreRef: Ref<HTMLDivElement | null>
}

export const useInfiniteLoader = ({ hasNextPage, fetchNextPage }: UseInfiniteLoaderProps): UseInfiniteLoaderReturn => {
	const loadMoreRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!hasNextPage || !loadMoreRef.current) return

		const observer = new IntersectionObserver(entries => {
			if (entries[0]?.isIntersecting) {
				fetchNextPage()
			}
		})

		observer.observe(loadMoreRef.current)
		return () => observer.disconnect()
	}, [ hasNextPage, fetchNextPage ])

	return { loadMoreRef }
}
