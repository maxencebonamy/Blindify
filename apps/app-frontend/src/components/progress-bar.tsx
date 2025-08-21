"use client"

type ProgressBarProps = {
	progress: number
	duration: number
	className?: string
}

export function ProgressBar({ progress, duration, className = "" }: ProgressBarProps) {
	return (
		<div className={`w-full bg-muted rounded-full h-2 overflow-hidden ${className}`}>
			<div
				className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 pulse-glow"
				style={{ width: `${progress}%` }}
			/>
			<div className="text-xs text-muted-foreground mt-2 text-center">
				{Math.round(((progress / 100) * duration) / 1000)}
				s /
				{duration / 1000}
				s
			</div>
		</div>
	)
}
