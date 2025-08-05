import { env } from "#/env"
import { redis } from "#/redis"
import { decode, encode } from "#/stringify"
import type { z } from "zod"

export const get = async <T>(key: string, schema?: z.ZodType<T>): Promise<T> => {
	const value = await redis.get(key)
	if (value === null) {
		throw new Error(`Cache miss for key: ${key}`)
	}

	const decodedValue = decode(value)
	if (schema === undefined) {
		return decodedValue as T
	}

	const parsedValue = schema.safeParse(decodedValue)
	if (!parsedValue.success) {
		throw new Error(`Failed to parse cached value for key: ${key}\n${parsedValue.error.message}`)
	}

	return parsedValue.data
}

export const set = async (key: string, value: unknown, ttl?: number): Promise<void> => {
	const encodedValue = encode(value)
	await redis.set(key, encodedValue, "EX", ttl || env.CACHE_TTL)
}

export const del = async (key: string): Promise<void> => {
	const result = await redis.del(key)
	if (result === 0) {
		throw new Error(`Cache delete failed for key: ${key}`)
	}
}

export const has = async (key: string): Promise<boolean> => {
	const value = await redis.get(key)
	return value !== null
}
