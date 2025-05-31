import moment from "moment"

export const currentTimestamp = (): string => {
	return moment().format("YYYY/MM/DD HH:mm:ss")
}

export const stringify = (value: unknown): string => {
	if (typeof value === "string") {
		return value
	}
	if (typeof value === "object") {
		return JSON.stringify(value)
	}
	return value !== undefined ? value.toString() : "undefined"
}
