import type { ComponentProps, ReactNode } from "react"
import { cn } from "#/utils/tailwind.util"

export type TextProps = ComponentProps<"p"> & {
	level: "heading-1" | "heading-2" | "heading-3" | "paragraph"
}

export const Text = ({ level, className, children, ...props }: TextProps): ReactNode => {
	const tailwind = cn(
		// Layout
		"",
		// Appearance
		"text-foreground",
		// Interaction
		"",
		// Level
		{
			"text-4xl font-bold": level === "heading-1",
			"text-2xl font-bold": level === "heading-2",
			"text-xl font-bold": level === "heading-3",
			"text-sm": level === "paragraph"
		},
		className
	)

	return (
		<p className={tailwind} {...props}>
			{children}
		</p>
	)
}
