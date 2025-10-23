import { cn } from "#/utils/tailwind.util"
import { forwardRef, type ComponentProps } from "react"

export type InputProps = ComponentProps<"input">

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
	const tailwind = cn(
		// Layout
		"px-4 py-2 h-10",
		// Appearance
		"whitespace-nowrap rounded-md text-sm border-2 border-foreground shadow-neo-sm ring-offset-background",
		// Interaction
		"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
		"disabled:pointer-events-none disabled:opacity-50",
		className
	)

	return (
		<input className={tailwind} {...props} ref={ref} />
	)
})

Input.displayName = "Input"
