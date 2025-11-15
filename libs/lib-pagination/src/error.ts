export class PaginationError extends Error {

	constructor(message: string) {
		super(message)
		this.name = "PaginationError"
	}

}
