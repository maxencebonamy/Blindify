import { describe, it, expect, vi, beforeEach } from "vitest"
import { type Token } from "lib-platform-connector"
import type { Platform } from "lib-database"
import { create } from "#/create/create"
import { database } from "lib-database"

vi.mock("lib-database", () => {
	return {
		database: {
			session: {
				create: vi.fn()
			}
		}
	}
})

describe("create", () => {
	const token: Token = {
		accessToken: "token123",
		refreshToken: "refresh123",
		accessExpiresAt: new Date()
	}
	const platform: Platform = "spotify"
	let mockCreate: ReturnType<typeof vi.fn>

	beforeEach(() => {
		mockCreate = database.session.create as unknown as ReturnType<typeof vi.fn>
	})

	it("should call database.session.create with correct data", async () => {
		mockCreate.mockResolvedValue({
			...token,
			platform,
			id: "session-id-123",
			createdAt: new Date(),
			lastUsedAt: new Date()
		})
		await create(token, platform)

		expect(mockCreate).toHaveBeenCalledWith({
			data: {
				...token,
				platform
			}
		})
	})

	it("should return the id of the created session", async () => {
		mockCreate.mockResolvedValue({
			...token,
			platform,
			id: "session-id-123",
			createdAt: new Date(),
			lastUsedAt: new Date()
		})
		const session = await create(token, platform)
		expect(session.id).toBe("session-id-123")
	})

	it("should handle null refreshToken", async () => {
		const tokenWithNull: Token = { ...token, refreshToken: null }
		mockCreate.mockResolvedValue({
			...tokenWithNull,
			platform,
			id: "session-id-123",
			createdAt: new Date(),
			lastUsedAt: new Date()
		})

		const session = await create(tokenWithNull, platform)
		expect(mockCreate).toHaveBeenCalledWith({
			data: {
				...tokenWithNull,
				platform
			}
		})
		expect(session.id).toBe("session-id-123")
	})

	it("should propagate errors from database.session.create", async () => {
		mockCreate.mockRejectedValue(new Error("DB error"))

		await expect(create(token, platform)).rejects.toThrow("DB error")
	})
})
