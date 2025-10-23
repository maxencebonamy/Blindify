import { useState, useEffect, type Dispatch, type SetStateAction } from "react"

export type UseDebouncedStateParams<T> = {
	initialValue: T
	delayMs?: number
}

export type UseDebouncedStateReturn<T> = {
	value: T
	debouncedValue: T
	setValue: Dispatch<SetStateAction<T>>
	setDebouncedValue: Dispatch<SetStateAction<T>>
}

export const useDebouncedState = <T>({ initialValue, delayMs = 500 }: UseDebouncedStateParams<T>): UseDebouncedStateReturn<T> => {
	const [ value, setValue ] = useState(initialValue)
	const [ debouncedValue, setDebouncedValue ] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delayMs)

		return () => clearTimeout(handler)
	}, [ value ])

	return { value, debouncedValue, setValue, setDebouncedValue }
}
