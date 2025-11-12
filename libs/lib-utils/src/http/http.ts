export const buildUrl = (base: string, queryParams: Record<string, string>): string => {
	const url = new URL(base)
	for (const [ key, value ] of Object.entries(queryParams)) {
		url.searchParams.set(key, value)
	}
	return url.toString()
}
