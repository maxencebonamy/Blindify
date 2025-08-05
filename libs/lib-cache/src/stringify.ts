type Encoded =
	| { type: "string", value: string }
	| { type: "number", value: string }
	| { type: "boolean", value: boolean }
	| { type: "null" }
	| { type: "undefined" }
	| { type: "bigint", value: string }
	| { type: "array", value: Encoded[] }
	| { type: "object", value: Record<string, Encoded> }
	| { type: "date", value: string }

const isEncoded = (data: unknown): data is Encoded => {
	if (typeof data !== "object" || data === null) return false

	const d = data as Record<string, unknown>

	if (typeof d.type !== "string") return false

	switch (d.type) {
		case "null":
		case "undefined":
			return Object.keys(d).length === 1

		case "string":
			return typeof d.value === "string"

		case "boolean":
			return typeof d.value === "boolean"

		case "bigint":
			return typeof d.value === "string"

		case "number":
			return typeof d.value === "string"

		case "date":
			return typeof d.value === "string"

		case "array":
			if (!Array.isArray(d.value)) return false
			return d.value.every(isEncoded)

		case "object":
			if (typeof d.value !== "object" || d.value === null) return false
			return Object.values(d.value).every(isEncoded)

		default:
			return false
	}
}

const isPlainObject = (o: unknown): o is Record<string, unknown> => {
	if (typeof o !== "object" || o === null) return false
	const proto = Object.getPrototypeOf(o)
	return proto === Object.prototype || proto === null
}

const encodeJson = (value: unknown): Encoded => {
	if (value === null) return { type: "null" }
	if (value === undefined) return { type: "undefined" }

	if (typeof value === "string") return { type: "string", value }
	if (typeof value === "boolean") return { type: "boolean", value }
	if (typeof value === "bigint") return { type: "bigint", value: value.toString() }
	if (typeof value === "number") {
		if (Number.isNaN(value)) return { type: "number", value: "NaN" }
		if (value === Infinity) return { type: "number", value: "Inf" }
		if (value === -Infinity) return { type: "number", value: "-Inf" }
		return { type: "number", value: value.toString() }
	}

	if (value instanceof Date) {
		return { type: "date", value: value.toISOString() }
	}

	if (Array.isArray(value)) {
		return { type: "array", value: value.map(encodeJson) }
	}

	if (isPlainObject(value)) {
		const obj: Record<string, Encoded> = {}
		for (const key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				obj[key] = encodeJson(value[key])
			}
		}
		return { type: "object", value: obj }
	}

	throw new Error("Unsupported value")
}

const decodeJson = (data: Encoded): unknown => {
	switch (data.type) {
		case "null": return null
		case "undefined": return undefined
		case "string": return data.value
		case "boolean": return data.value
		case "bigint": return BigInt(data.value)
		case "number":
			if (data.value === "NaN") return NaN
			if (data.value === "Inf") return Infinity
			if (data.value === "-Inf") return -Infinity
			return Number(data.value)
		case "date": return new Date(data.value)
		case "array": return data.value.map(decodeJson)
		case "object": {
			const obj: Record<string, unknown> = {}
			for (const k in data.value) {
				obj[k] = decodeJson(data.value[k])
			}
			return obj
		}
	}
}

export const encode = (value: unknown): string => {
	return JSON.stringify(encodeJson(value))
}

export const decode = (json: string): unknown => {
	const parsed = JSON.parse(json)
	if (!isEncoded(parsed)) {
		throw new Error("Invalid encoded data")
	}
	return decodeJson(parsed)
}
