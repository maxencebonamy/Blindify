import { cn } from "#/utils/tailwind.util"

export type SkeletonProps = {
	className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
	const tailwind = cn(
		// Layout
		"",
		// Appearance
		"bg-foreground/10 rounded-sm",
		// Interaction
		"animate-pulse",
		className
	)

	return (
		<div className={tailwind} />
	)
}
