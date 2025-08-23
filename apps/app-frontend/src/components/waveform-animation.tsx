"use client"

import { useState } from "react"

type WaveformAnimationProps = {
	isPlaying: boolean
	className?: string
}

export function WaveformAnimation({ isPlaying, className = "" }: WaveformAnimationProps) {
	const [ bars ] = useState(() => Array.from({ length: 20 }, (_, i) => i))

	return (
		<div className={`flex items-center justify-center gap-1 ${className}`}>
			{bars.map(bar => (
				<div
					key={bar}
					className={`w-1 bg-primary rounded-full transition-all duration-300 ${isPlaying ? "waveform-bar" : "h-2"}`}
					style={{
						height: isPlaying ? `${Math.random() * 40 + 10}px` : "8px",
						animationDelay: `${bar * 0.1}s`
					}}
				/>
			))}
		</div>
	)
}
