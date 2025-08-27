import { cn } from "#/utils/tailwind.util"
import { useEffect, useState } from "react"

export type RoundIndicatorProps = {
	state: "notStarted" | "inProgress" | "done"
	className?: string
}

type State = RoundIndicatorProps["state"]

export const RoundIndicator = ({ state, className }: RoundIndicatorProps) => {
	const [ actualState, setActualState ] = useState<State>(state)
	const [ isInTransition, setIsInTransition ] = useState(false)

	useEffect(() => {
		if (state === actualState) return
		setIsInTransition(true)
		const timeout = setTimeout(() => {
			setIsInTransition(false)
			setActualState(state)
		}, 500)
		return () => clearTimeout(timeout)
	}, [ state ])

	const tailwind = cn(
		// Container
		"size-6",
		// Appearance
		"rounded-full border-2 border-foreground shadow-neo-sm ring-offset-background",
		// Interaction
		"transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
		"disabled:pointer-events-none disabled:opacity-50 duration-500",
		// States
		{
			"bg-background": actualState === "notStarted",
			"bg-primary": actualState === "inProgress",
			"bg-secondary": actualState === "done"
		},
		// Transition
		{
			"translate-0.5 shadow-neo-none": isInTransition
		},
		className
	)

	return (
		<div className={tailwind} />
	)
}
