import { Skeleton } from "#/components/atoms/skeleton"
import { Text } from "#/components/atoms/text"
import { Card, type CardProps } from "#/components/molecules/card"
import { Image } from "#/components/molecules/image"
import type { CatalogArtist } from "#/generated"

export type ArtistCardProps = {
	artist: CatalogArtist
	link?: CardProps["link"]
	className?: string
}

export const ArtistCard = ({ artist, link, className }: ArtistCardProps) => {
	return (
		<Card link={link} className={className}>
			<Image
				src={artist.avatar ?? ""}
				alt={artist.name}
				className="w-full aspect-square object-cover rounded-sm border border-foreground"
			/>
			<Text level="heading-3" className="text-center line-clamp-2 max-w-full mt-1">
				{artist.name}
			</Text>
		</Card>
	)
}

export const ArtistCardSkeleton = ({ className }: { className?: string }) => {
	return (
		<Card className={className}>
			<Skeleton className="w-full aspect-square rounded-sm border border-foreground" />
			<Skeleton className="w-32 h-6 mt-1" />
		</Card>
	)
}
