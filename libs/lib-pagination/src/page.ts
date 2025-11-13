import z from "zod"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const zPage = <T>(zItem: z.ZodType<T>) => z.object({
	currentPage: z.int().min(1), // current page, from 1 to whatever
	previousPage: z.int().min(1).nullable(), // previous page = page - 1 (or null if the current page is the first one)
	nextPage: z.int().min(2).nullable(), // next page = page + 1 (or null if the current page is the last one)
	totalPages: z.int().min(1), // total of pages (minimum 1 because empty page is allowed)
	totalItems: z.int().min(0), // total of items in all pages (must be consistent with the total of pages and the page size)
	pageSize: z.int().min(1), // page size in general (can be greater than the items length, for example with the last page)
	items: z.array(zItem) // only items of that page
}).superRefine((data, ctx) => {
	const expectedTotalPages = Math.max(1, Math.ceil(data.totalItems / data.pageSize))
	if (data.totalPages !== expectedTotalPages) {
		ctx.addIssue({
			code: "custom",
			message: `totalPages should be ${expectedTotalPages}`,
			path: [ "totalPages" ]
		})
	}

	if (data.currentPage > data.totalPages) {
		ctx.addIssue({
			code: "custom",
			message: "currentPage cannot be greater than totalPages",
			path: [ "currentPage" ]
		})
	}

	if (data.currentPage === 1 && data.previousPage !== null) {
		ctx.addIssue({
			code: "custom",
			message: "previousPage must be null on first page",
			path: [ "previousPage" ]
		})
	}
	if (data.currentPage > 1 && data.previousPage !== data.currentPage - 1) {
		ctx.addIssue({
			code: "custom",
			message: "previousPage must be currentPage - 1",
			path: [ "previousPage" ]
		})
	}

	if (data.currentPage === data.totalPages && data.nextPage !== null) {
		ctx.addIssue({
			code: "custom",
			message: "nextPage must be null on last page",
			path: [ "nextPage" ]
		})
	}
	if (data.currentPage < data.totalPages && data.nextPage !== data.currentPage + 1) {
		ctx.addIssue({
			code: "custom",
			message: "nextPage must be currentPage + 1",
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
		data.currentPage === data.totalPages
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
