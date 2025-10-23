import type { ReactNode } from "react"
import { cn } from "#/utils/tailwind.util"
import { Loader2Icon } from "lucide-react"

export type LoaderProps = {
	className?: string
}

export const Loader = ({ className }: LoaderProps): ReactNode => {
	const tailwind = cn(
		// Layout
		"size-8",
		// Appearance
		"stroke-foreground stroke-2",
		// Interaction
		"animate-spin",
		className
	)

	return (
		<Loader2Icon className={tailwind} />
	)
}
