import { Image } from "#/components/molecules/image"
import type { CatalogArtist } from "#/generated"
import { cn } from "#/utils/tailwind.util"

export type ArtistIndicatorProps = {
	artist: CatalogArtist
	className?: string
}

export const ArtistIndicator = ({ artist, className }: ArtistIndicatorProps) => {
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
				<p className="text-xs">From artist</p>
				<p className="text-xl font-bold -mb-1">{artist.name}</p>
			</div>
			{artist.avatar && (
				<Image src={artist.avatar} className="size-10 rounded-md shadow-neo-sm border-2 border-foreground" />
			)}
		</div>
	)
}
