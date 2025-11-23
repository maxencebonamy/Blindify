import { useEffect, useState } from "react"

const breakpoints = {
	"sm": "(min-width: 640px)",
	"md": "(min-width: 768px)",
	"lg": "(min-width: 1024px)",
	"xl": "(min-width: 1280px)",
	"2xl": "(min-width: 1536px)"
}

type Breakpoint = keyof typeof breakpoints | "base"

export const useBreakpoint = (): Breakpoint => {
	const getCurrent = (): Breakpoint => {
		let current: Breakpoint = "base"
		for (const [ key, query ] of Object.entries(breakpoints)) {
			if (window.matchMedia(query).matches) current = key as Breakpoint
		}
		return current
	}

	const [ breakpoint, setBreakpoint ] = useState<ReturnType<typeof getCurrent>>(
		typeof window !== "undefined" ? getCurrent() : "base"
	)

	useEffect(() => {
		const mediaQueries = Object.entries(breakpoints).map(([ key, query ]) => [
			key,
			window.matchMedia(query)
		] as const)

		const handler = (): void => setBreakpoint(getCurrent())

		mediaQueries.forEach(([ , mediaQuery ]) => mediaQuery.addEventListener("change", handler))
		return () => mediaQueries.forEach(([ , mediaQuery ]) => mediaQuery.removeEventListener("change", handler))
	}, [])

	return breakpoint
}
