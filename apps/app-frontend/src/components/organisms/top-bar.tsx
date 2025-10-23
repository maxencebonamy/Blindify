import { GameTitle } from "#/components/atoms/game-title"
import { Icon } from "#/components/atoms/icon"
import { Row } from "#/components/atoms/row"
import { Button } from "#/components/molecules/button"
import { cn } from "#/utils/tailwind.util"
import { Link } from "@tanstack/react-router"
import { LogOutIcon } from "lucide-react"
import type { ReactNode } from "react"

export type TopBarProps = {
	left?: ReactNode
}

export const TopBar = ({ left }: TopBarProps) => {
	const tailwind = cn(
		// Layout
		"fixed z-50 top-0 left-0 right-0 w-full h-16 grid grid-cols-3 items-center px-4",
		// Appearance
		"border-b-2 border-foreground bg-secondary shadow-neo-sm",
		// Interaction
		""
	)

	return (
		<div className="flex-none h-16">
			<Row className={tailwind}>
				{left ?? <span />}

				<GameTitle className="h-12 mt-2" />

				<Link to="/login" className="justify-self-end">
					<Button variant="outline">
						<Icon icon={LogOutIcon} />
						Logout
					</Button>
				</Link>
			</Row>
		</div>
	)
}
