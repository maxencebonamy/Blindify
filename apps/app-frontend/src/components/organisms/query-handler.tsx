import { Loader } from "#/components/atoms/loader"
import { Text } from "#/components/atoms/text"
import type { UseQueryResult } from "@tanstack/react-query"
import type { ReactNode } from "react"

export type QueryHandlerProps<TData, TError> = {
	result: UseQueryResult<TData, TError>
	handler: (data: TData) => ReactNode
	loader?: ReactNode
}

export const QueryHandler = <TData, TError>({ result: queryResult, handler, loader }: QueryHandlerProps<TData, TError>) => {
	const { data, isPending, isError } = queryResult

	if (isPending) {
		if (loader) return loader
		return <Loader />
	}

	if (isError) return (
		<Text level="paragraph">Sorry, an error occured...</Text>
	)

	return handler(data)
}
