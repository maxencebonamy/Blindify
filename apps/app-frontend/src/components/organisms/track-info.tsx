import { Icon } from "#/components/atoms/icon"
import type { Track } from "#/generated"
import { cn } from "#/utils/tailwind.util"
import { Disc3Icon, Mic2Icon } from "lucide-react"

export type TrackInfoProps = {
	track: Track
	className?: string
}

export const TrackInfo = ({ track, className }: TrackInfoProps) => {
	const tailwind = cn(
		// Layout
		"flex flex-col items-center gap-6",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	return (
		<div className={tailwind}>
			{track.coverUrl && (
				<img src={track.coverUrl} className="size-72 rounded-xl border-2 border-foreground shadow-neo-md" />
			)}
			<div className="flex flex-col items-center gap-1">
				<p className="text-2xl font-bold">{track.title}</p>
				<div className="flex gap-6">
					<span className="flex items-center gap-1">
						<Icon icon={Mic2Icon} />
						{track.artists.join(", ")}
					</span>
					<span className="flex items-center gap-1">
						<Icon icon={Disc3Icon} className="animate-[spin_3s_linear_infinite] duration-700" />
						{track.album}
					</span>
				</div>
			</div>
		</div>
	)
}
