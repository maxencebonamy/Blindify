import { Col } from "#/components/atoms/col"
import { cn } from "#/utils/tailwind.util"
import { Link, type LinkProps } from "@tanstack/react-router"
import type { PropsWithChildren } from "react"

export type CardProps = PropsWithChildren<{
	className?: string
	link?: LinkProps
}>

export const Card = ({ className, link, children }: CardProps) => {
	const tailwind = cn(
		// Layout
		"items-center gap-2 p-2",
		// Appearance
		"rounded-md border border-2 border-foreground shadow-neo-sm",
		// Interaction
		"",
		// Link
		{ "cursor-pointer transition-all hover:translate-0.5 hover:shadow-neo-none": link },
		className
	)

	if (link) {
		return (
			<Link className={tailwind} {...link}>
				{children}
			</Link>
		)
	}

	return (
		<Col className={tailwind}>
			{children}
		</Col>
	)
}
