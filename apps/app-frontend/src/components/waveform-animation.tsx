import { cn } from "#/utils/tailwind.util"
import { useEffect, useState } from "react"

type WaveformAnimationProps = {
	barCount: number
	className?: string
}

export function WaveformAnimation({ barCount, className = "" }: WaveformAnimationProps) {
	const [ bars, setBars ] = useState(() => Array.from({ length: barCount }, () => 100))

	useEffect(() => {
		const timer = setInterval(() => {
			setBars(Array.from({ length: barCount }, () => Math.max(20, Math.random() * 100)))
		}, 1000 / 5)

		return () => clearInterval(timer)
	}, [ barCount ])

	const tailwind = cn(
		// Layout
		"flex items-center gap-2",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	const barTailwind = cn(
		// Layout
		"w-2",
		// Appearance
		"rounded-full bg-primary border-2 border-foreground shadow-neo-sm",
		// Interaction
		"transition-all duration-200 ease-linear"
	)

	return (
		<div className={tailwind}>
			{bars.map((bar, index) => (
				<div
					key={index}
					className={barTailwind}
					style={{
						height: `${bar}%`
					}}
				/>
			))}
		</div>
	)
}
