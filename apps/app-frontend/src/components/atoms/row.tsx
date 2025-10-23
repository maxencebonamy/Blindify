import { cn } from "#/utils/tailwind.util"
import type { ComponentProps } from "react"

export type RowProps = ComponentProps<"div">

export const Row = ({ className, children, ...props }: RowProps) => {
	const tailwind = cn(
		// Layout
		"flex flex-row",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	return (
		<div className={tailwind} {...props}>
			{children}
		</div>
	)
}
