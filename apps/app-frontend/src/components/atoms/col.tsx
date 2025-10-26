import { cn } from "#/utils/tailwind.util"
import type { ComponentProps } from "react"

export type ColProps = ComponentProps<"div">

export const Col = ({ className, children, ...props }: ColProps) => {
	const tailwind = cn(
		// Layout
		"flex flex-col",
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
