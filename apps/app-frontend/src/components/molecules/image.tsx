import { Skeleton } from "#/components/atoms/skeleton"
import { cn } from "#/utils/tailwind.util"
import { useState, type ComponentProps, type ReactEventHandler } from "react"

export type ImageProps = ComponentProps<"img">

export const Image = ({ className, onLoad, loading = "lazy", decoding = "async", ...props }: ImageProps) => {
	const [ loaded, setLoaded ] = useState(false)

	const tailwind = cn(
		// Layout
		"relative overflow-hidden",
		// Appearance
		"",
		// Interaction
		"",
		className
	)

	const handleLoad: ReactEventHandler<HTMLImageElement> = e => {
		setLoaded(true)
		onLoad?.(e)
	}

	return (
		<div className={tailwind}>
			{!loaded && (
				<Skeleton className="absolute size-full" />
			)}

			<img
				onLoad={handleLoad}
				className={loaded ? "opacity-100" : "opacity-0"}
				loading={loading}
				decoding={decoding}
				{...props}
			/>
		</div>
	)
}
