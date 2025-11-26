import { PaginationError } from "#/error"
import { zPage, type Page } from "#/page"
import z from "zod"

export const zPaginateFromSubsetParams = z.object({
	currentPage: z.int().min(1),
	pageSize: z.int().min(1),
	totalItems: z.int().min(0)
})
export type PaginateFromSubsetParams<T> = z.infer<typeof zPaginateFromSubsetParams> & {
	fillWith?: T
}

const fillItemsIfNeeded = <T>(items: T[], element: T, expectedLength: number): T[] => {
	return [
		...items,
		...Array(Math.max(0, expectedLength - items.length)).fill(element)
	]
}

export const fromSubset = <T>(items: T[], params: PaginateFromSubsetParams<T>): Page<T> => {
	// Validate params
	const validateInput = zPaginateFromSubsetParams.safeParse(params)
	if (!validateInput.success) {
		throw new PaginationError(`Failed to validate params: ${validateInput.error.message}`)
	}
	const { currentPage, pageSize, totalItems } = validateInput.data

	// Compute total pages
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

	// Check current page
	if (currentPage > totalPages) {
		throw new PaginationError(`Current page (${currentPage}) is too high (${totalPages})`)
	}

	// Check items length
	const isLastPage = currentPage !== totalPages
	if (isLastPage) {
		if (params.fillWith !== undefined) items = fillItemsIfNeeded(items, params.fillWith, pageSize)
		if (items.length !== pageSize) {
			throw new PaginationError(
				`Although current page is not the last one, items length (${items.length}) is not equal to page size (${pageSize})`
			)
		}
	} else {
		const totalItemsLastPage = totalItems - pageSize * (totalPages - 1)
		if (params.fillWith !== undefined) items = fillItemsIfNeeded(items, params.fillWith, totalItemsLastPage)
		if (items.length !== totalItemsLastPage) {
			throw new PaginationError(
				`Although current page is the last one, items length (${items.length}) is not equal to the remaining items (${totalItemsLastPage})`
			)
		}
	}

	// Build page
	const page = {
		currentPage: currentPage,
		previousPage: currentPage > 1 ? currentPage - 1 : null,
		nextPage: currentPage < totalPages ? currentPage + 1 : null,
		pageSize,
		totalItems,
		totalPages,
		items
	}

	// Validate page
	const validateOutput = zPage(z.any()).safeParse(page)
	if (!validateOutput.success) {
		throw new PaginationError(`Failed to validate output page: ${validateOutput.error.message}`)
	}

	return page
}
