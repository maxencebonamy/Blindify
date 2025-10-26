import { Icon } from "#/components/atoms/icon"
import { Row } from "#/components/atoms/row"
import { Text } from "#/components/atoms/text"
import { Button } from "#/components/molecules/button"
import { invalidateUserPlaylistsCacheMutation, indexUserPlaylistsInfiniteQueryKey } from "#/generated/@tanstack/react-query.gen"
import { cn } from "#/utils/tailwind.util"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RefreshCwIcon } from "lucide-react"

export type InvalidateCacheButtonProps = {
	lastRefresh: Date | undefined
	className?: string
}

export const InvalidateCacheButton = ({ lastRefresh, className }: InvalidateCacheButtonProps) => {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		...invalidateUserPlaylistsCacheMutation(),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: indexUserPlaylistsInfiniteQueryKey() })
	})

	const tailwind = cn(
		// Layout
		"items-center gap-4",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	return (
		<Row className={tailwind}>
			{lastRefresh && (
				<Text level="paragraph">
					Last refresh:
					{" "}
					{lastRefresh.toLocaleTimeString()}
				</Text>
			)}
			<Button size="icon" variant="outline" onClick={() => mutate({})}>
				<Icon icon={RefreshCwIcon} className={cn("duration-1000 transition-all", { "rotate-180": isPending })} />
			</Button>
		</Row>
	)
}
