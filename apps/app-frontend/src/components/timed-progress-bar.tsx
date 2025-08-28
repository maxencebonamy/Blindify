import { type ProgressBarProps, ProgressBar } from "#/components/progress-bar"
import { useEffect, useState } from "react"

type TimedProgressBarProps = Omit<ProgressBarProps, "percent"> & {
	durationMs: number
}

export const TimedProgressBar = ({ durationMs, ...props }: TimedProgressBarProps) => {
	const [ percent, setPercent ] = useState(100)

	useEffect(() => {
		if (durationMs <= 0) {
			setPercent(0)
			return
		}

		const start = Date.now()
		const timer = setInterval(() => {
			const elapsed = Date.now() - start
			const newPercent = Math.max(100 - (elapsed / durationMs) * 100, 0)
			setPercent(newPercent)

			if (elapsed >= durationMs) {
				clearInterval(timer)
			}
		}, 1000 / 120) // ~60fps

		return () => clearInterval(timer)
	}, [ durationMs ])

	return <ProgressBar {...props} percent={percent} />
}
