import { Loader } from "#/components/atoms/loader"
import { cn } from "#/utils/tailwind.util"

export const LoadingScreen = () => {
	const tailwind = cn(
		// Layout
		"min-h-screen flex items-center justify-center",
		// Appearance
		"",
		// Interaction
		""
	)

	return (
		<div className={tailwind}>
			<Loader />
		</div>
	)
}
