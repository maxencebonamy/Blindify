import { Image } from "#/components/molecules/image"
import type { Playlist } from "#/generated"
import { cn } from "#/utils/tailwind.util"

export type PlaylistIndicatorProps = {
	playlist: Playlist
	className?: string
}

export const PlaylistIndicator = ({ playlist, className }: PlaylistIndicatorProps) => {
	const tailwind = cn(
		// Layout
		"flex items-center gap-4",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	return (
		<div className={tailwind}>
			<div className="flex flex-col items-end">
				<p className="text-xs">From playlist</p>
				<p className="text-xl font-bold -mb-1">{playlist.name}</p>
			</div>
			{playlist.cover && (
				<Image src={playlist.cover} className="size-10 rounded-md shadow-neo-sm border-2 border-foreground" />
			)}
		</div>
	)
}
