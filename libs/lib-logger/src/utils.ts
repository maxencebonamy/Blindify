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

export const getCaller = (): string | null => {
	const err = new Error("lib-logger")
	const stack = (err.stack || "").split("\n")

	const line = stack.find(e => !e.includes("lib-logger"))
	if (!line) return null

	const elements = line.split("/")
	const project = elements.find(e => e.startsWith("app-") || e.startsWith("lib-")) ?? ""
	const file = elements.find(e => e.includes(".js") || e.includes(".ts"))?.replace(")", "") ?? ""
	return `${project}:${file}`
}
