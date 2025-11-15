import { useState, useEffect, type Dispatch, type SetStateAction } from "react"

export const useDebouncedState = <T>(value: T, delayMs: number = 500): [ T, Dispatch<SetStateAction<T>> ] => {
	const [ debouncedValue, setDebouncedValue ] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delayMs)

		return () => clearTimeout(handler)
	}, [ value ])

	return [ debouncedValue, setDebouncedValue ]
}
