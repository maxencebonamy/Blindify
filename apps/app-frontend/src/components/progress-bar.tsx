import { cn } from "#/utils/tailwind.util"

export type ProgressBarProps = {
	variant?: "primary" | "secondary" | "destructive"
	percent: number
	className?: string
}

export const ProgressBar = ({ variant = "primary", percent, className }: ProgressBarProps) => {
	const tailwind = cn(
		// Layout
		"h-10 overflow-hidden relative",
		// Appearance
		"rounded-full bg-background border-2 border-foreground shadow-neo-sm",
		// Interaction
		"",
		className
	)

	const progressTailwind = cn(
		// Layout
		"size-full absolute",
		// Appearance
		"rounded-full outline-2 outline-foreground",
		// Interaction
		"",
		// Variant
		{
			"bg-primary": variant === "primary",
			"bg-secondary": variant === "secondary",
			"bg-destructive": variant === "destructive"
		},
		// Percent
		{
			"outline-none": percent === 0
		}
	)

	return (
		<div className={tailwind}>
			<div className={progressTailwind} style={{ left: `-${100 - percent}%` }} />
		</div>
	)
}
