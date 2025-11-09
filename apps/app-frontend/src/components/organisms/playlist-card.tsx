import { Col } from "#/components/atoms/col"
import { Skeleton } from "#/components/atoms/skeleton"
import { Text } from "#/components/atoms/text"
import { Card, type CardProps } from "#/components/molecules/card"
import type { Playlist } from "#/generated"

export type PlaylistCardProps = {
	playlist: Playlist
	link?: CardProps["link"]
	className?: string
}

export const PlaylistCard = ({ playlist, link, className }: PlaylistCardProps) => {
	return (
		<Card link={link} className={className}>
			<img
				src={playlist.cover ?? ""}
				alt={playlist.name}
				className="w-full aspect-square object-cover rounded-sm border border-foreground"
			/>
			<Col className="items-center">
				<Text level="heading-3" className="text-center">
					{playlist.name}
				</Text>
				<Text level="paragraph">
					{playlist.trackCount}
					{" "}
					tracks
				</Text>
			</Col>
		</Card>
	)
}

export const PlaylistCardSkeleton = ({ className }: { className?: string }) => {
	return (
		<Card className={className}>
			<Skeleton className="w-full aspect-square rounded-sm border border-foreground" />
			<Col className="items-center gap-2">
				<Skeleton className="w-32 h-6" />
				<Skeleton className="w-16 h-4" />
			</Col>
		</Card>
	)
}
