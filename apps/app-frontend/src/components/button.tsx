import { cn } from "#/utils/tailwind.util"
import type { ComponentProps } from "react"

export type ButtonProps = ComponentProps<"button"> & {
	variant?: "primary" | "secondary" | "outline" | "destructive"
	size?: "default" | "icon"
}

export const Button = ({ variant = "primary", size = "default", className, children, ...props }: ButtonProps) => {
	const tailwind = cn(
		// Container
		"inline-flex items-center justify-center gap-2",
		// Appearance
		"whitespace-nowrap rounded-md text-sm border-2 border-foreground shadow-neo-sm ring-offset-background",
		// Interaction
		"cursor-pointer transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
		"disabled:pointer-events-none disabled:opacity-50 hover:translate-0.5 hover:shadow-neo-none",
		// Variant
		{
			"text-foreground bg-primary": variant === "primary",
			"text-foreground bg-secondary": variant === "secondary",
			"text-foreground bg-background": variant === "outline",
			"text-background bg-destructive": variant === "destructive"
		},
		// Size
		{
			"px-4 py-2 h-10": size === "default",
			"px-2 py-2 h-10 w-10": size === "icon"
		},
		className
	)

	return (
		<button className={tailwind} {...props}>
			{children}
		</button>
	)
}
