import type { PagingObject } from "#/generated"
import z from "zod"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const zPage = <T>(zItem: z.ZodType<T>) => z.object({
	page: z.number().int().min(1),
	previousPage: z.number().int().min(1).nullable(),
	nextPage: z.number().int().min(2).nullable(),
	totalPages: z.number().int().min(1),
	totalItems: z.number().int().min(0),
	pageSize: z.number().int().min(1),
	items: z.array(zItem)
}).superRefine((data, ctx) => {
	const expectedTotalPages = Math.max(1, Math.ceil(data.totalItems / data.pageSize))
	if (data.totalPages !== expectedTotalPages) {
		ctx.addIssue({
			code: "custom",
			message: `totalPages should be ${expectedTotalPages}`,
			path: [ "totalPages" ]
		})
	}

	if (data.page > data.totalPages) {
		ctx.addIssue({
			code: "custom",
			message: "page cannot be greater than totalPages",
			path: [ "page" ]
		})
	}

	if (data.page === 1 && data.previousPage !== null) {
		ctx.addIssue({
			code: "custom",
			message: "previousPage must be null on first page",
			path: [ "previousPage" ]
		})
	}
	if (data.page > 1 && data.previousPage !== data.page - 1) {
		ctx.addIssue({
			code: "custom",
			message: "previousPage must be page - 1",
			path: [ "previousPage" ]
		})
	}

	if (data.page === data.totalPages && data.nextPage !== null) {
		ctx.addIssue({
			code: "custom",
			message: "nextPage must be null on last page",
			path: [ "nextPage" ]
		})
	}
	if (data.page < data.totalPages && data.nextPage !== data.page + 1) {
		ctx.addIssue({
			code: "custom",
			message: "nextPage must be page + 1",
			path: [ "nextPage" ]
		})
	}

	if (data.items.length > data.pageSize) {
		ctx.addIssue({
			code: "custom",
			message: "items length cannot exceed pageSize",
			path: [ "items" ]
		})
	}

	if (
		data.page === data.totalPages
		&& data.totalItems > 0
		&& data.items.length !== data.totalItems - (data.pageSize * (data.totalPages - 1))
	) {
		ctx.addIssue({
			code: "custom",
			message: "items length does not match remaining items on last page",
			path: [ "items" ]
		})
	}
})

export type Page<T> = z.infer<ReturnType<typeof zPage<T>>>

export const paginateFromAllItems = <T>(allItems: T[], page: number, limit: number): Page<T> => {
	const totalPages = Math.max(1, Math.ceil(allItems.length / limit))
	if (page > totalPages) page = totalPages

	const startIndex = (page - 1) * limit
	const endIndex = Math.min(startIndex + limit, allItems.length)

	return {
		page,
		previousPage: page > 1 ? page - 1 : null,
		nextPage: page < totalPages ? page + 1 : null,
		pageSize: limit,
		totalItems: allItems.length,
		totalPages,
		items: allItems.slice(startIndex, endIndex)
	}
}

export const paginateFromSpotify = <T>(spotifyPage: PagingObject, items: T[]): Page<T> => {
	const page = Math.floor(spotifyPage.offset / spotifyPage.limit) + 1
	const totalPages = Math.max(1, Math.ceil(spotifyPage.total / spotifyPage.limit))

	return {
		page,
		previousPage: (spotifyPage.previous && page > 1) ? page - 1 : null,
		nextPage: (spotifyPage.next && page < totalPages) ? page + 1 : null,
		pageSize: spotifyPage.limit,
		totalItems: spotifyPage.total,
		totalPages,
		items
	}
}
