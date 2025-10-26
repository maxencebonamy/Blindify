import { Icon } from "#/components/atoms/icon"
import { Text } from "#/components/atoms/text"
import { Button } from "#/components/molecules/button"
import { cn } from "#/utils/tailwind.util"
import { Link } from "@tanstack/react-router"
import { HouseIcon } from "lucide-react"

export type ErrorScreenProps = {
	message?: string
}

export const ErrorScreen = ({ message }: ErrorScreenProps) => {
	if (!message) {
		message = "An unexpected error occurred..."
	}

	const tailwind = cn(
		// Layout
		"min-h-screen flex flex-col items-center justify-center gap-8",
		// Appearance
		"",
		// Interaction
		""
	)

	return (
		<div className={tailwind}>
			<Text level="heading-1">
				{message}
			</Text>

			<Link to="/">
				<Button>
					<Icon icon={HouseIcon} />
					Back to home
				</Button>
			</Link>
		</div>
	)
}
