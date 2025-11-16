import { describe, it, expect, vi, beforeEach } from "vitest"
import { database } from "lib-database"
import { revoke } from "#/revoke/revoke"

vi.mock("lib-database", () => {
	return {
		database: {
			session: {
				delete: vi.fn()
			}
		}
	}
})

describe("revoke", () => {
	const sessionId = "session-id-123"
	let mockDelete: ReturnType<typeof vi.fn>

	beforeEach(() => {
		mockDelete = database.session.delete as unknown as ReturnType<typeof vi.fn>
		mockDelete.mockReset()
		mockDelete.mockResolvedValue({}) // Prisma delete returns the deleted record normally, we just resolve empty for simplicity
	})

	it("should call database.session.delete with correct id", async () => {
		await revoke(sessionId)
		expect(mockDelete).toHaveBeenCalledTimes(1)
		expect(mockDelete).toHaveBeenCalledWith({
			where: { id: sessionId }
		})
	})

	it("should propagate errors from database.session.delete", async () => {
		mockDelete.mockRejectedValue(new Error("DB error"))

		await expect(revoke(sessionId)).rejects.toThrow("DB error")
	})
})
