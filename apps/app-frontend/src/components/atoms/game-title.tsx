import { cn } from "#/utils/tailwind.util"

export type GameTitleProps = {
	className?: string
}

export const GameTitle = ({ className }: GameTitleProps) => {
	const tailwind = cn(
		// Layout
		"w-full h-auto",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	const textTailwind = cn(
		// Layout
		"",
		// Appearance
		"text-5xl font-black fill-primary stroke-2 stroke-foreground tracking-tight",
		// Interaction
		""
	)

	return (
		<svg viewBox="0 0 180 60" className={tailwind} aria-label="Blindify" role="img">
			<defs>
				<filter id="shadow-neo" x="-50%" y="-50%" width="200%" height="200%">
					<feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="var(--color-foreground)" />
				</filter>
			</defs>
			<text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className={textTailwind} filter="url(#shadow-neo)">
				Blindify
			</text>
		</svg>
	)
}
