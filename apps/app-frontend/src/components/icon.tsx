import type { ComponentProps, ReactNode } from "react"
import { cn } from "#/utils/tailwind.util"
import type { LucideIcon } from "lucide-react"

export type IconProps = ComponentProps<LucideIcon> & {
	icon: LucideIcon
}

export const Icon = ({ className, icon: Icon, ...props }: IconProps): ReactNode => {
	const tailwind = cn(
		"size-4",
		className
	)

	return (
		<Icon className={tailwind} {...props} />
	)
}
