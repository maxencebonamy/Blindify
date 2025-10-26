import { Icon } from "#/components/atoms/icon"
import { cn } from "#/utils/tailwind.util"
import { Loader2 } from "lucide-react"
import type { ComponentProps } from "react"

export type ButtonProps = ComponentProps<"button"> & {
	variant?: "primary" | "secondary" | "outline" | "destructive"
	size?: "default" | "icon"
	loading?: boolean
}

export const Button = ({ variant = "primary", size = "default", loading, className, children, ...props }: ButtonProps) => {
	const tailwind = cn(
		// Layout
		"relative",
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

	const contentTailwind = cn(
		// Layout
		"inline-flex h-full items-center justify-center gap-2",
		// Appearance
		"",
		// Interaction
		"",
		// Loading
		loading && "opacity-0"
	)

	return (
		<button className={tailwind} {...props}>
			<span className={contentTailwind}>
				{children}
			</span>
			{loading && (
				<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<Icon icon={Loader2} className="animate-spin" />
				</span>
			)}
		</button>
	)
}
