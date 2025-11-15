import { PaginationError } from "#/error"
import { zPage, type Page } from "#/page"
import z from "zod"

export const zPaginateFromSourceParams = z.object({
	currentPage: z.int().min(1),
	pageSize: z.int().min(1)
})
export type PaginateFromSourceParams = z.infer<typeof zPaginateFromSourceParams>

export const fromSource = <T>(allItems: T[], params: PaginateFromSourceParams): Page<T> => {
	// Validate params
	const validateInput = zPaginateFromSourceParams.safeParse(params)
	if (!validateInput.success) {
		throw new PaginationError(`Failed to validate params: ${validateInput.error.message}`)
	}
	const { currentPage, pageSize } = validateInput.data

	// Compute total pages
	const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize))

	// Check current page
	if (currentPage > totalPages) {
		throw new PaginationError(`Current page (${currentPage}) is too high (${totalPages})`)
	}

	// Compute slice indexes
	const startIndex = (currentPage - 1) * pageSize
	const endIndex = Math.min(startIndex + pageSize, allItems.length)

	// Build page
	const page = {
		currentPage: currentPage,
		previousPage: currentPage > 1 ? currentPage - 1 : null,
		nextPage: currentPage < totalPages ? currentPage + 1 : null,
		pageSize,
		totalItems: allItems.length,
		totalPages,
		items: allItems.slice(startIndex, endIndex)
	}

	// Validate page
	const validateOutput = zPage(z.any()).safeParse(page)
	if (!validateOutput.success) {
		throw new PaginationError(`Failed to validate output page: ${validateOutput.error.message}`)
	}

	return page
}
