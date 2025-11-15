import { describe, it, expect, vi, beforeEach } from "vitest"
import moment from "moment"
import { retrieve } from "#/retrieve/retrieve"
import { database } from "lib-database"
import { revoke } from "#/revoke/revoke"
import { connector } from "lib-platform-connector"
import { logger } from "lib-logger"

vi.mock("lib-database", () => ({
	database: {
		session: {
			findUnique: vi.fn(),
			delete: vi.fn(),
			update: vi.fn()
		}
	}
}))

vi.mock("lib-platform-connector", () => ({
	connector: vi.fn()
}))

vi.mock("lib-logger", () => ({
	logger: {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn()
	}
}))

vi.mock("#/revoke/revoke", async () => {
	return {
		revoke: vi.fn()
	}
})

describe("getSession", () => {
	const sessionId = "session-id-123"
	const mockSession = {
		id: sessionId,
		accessToken: "token",
		refreshToken: "refresh",
		accessExpiresAt: new Date(),
		createdAt: new Date(),
		lastUsedAt: new Date(),
		platform: "spotify"
	}

	let findUniqueMock: ReturnType<typeof vi.fn>
	let deleteSessionMock: ReturnType<typeof vi.fn>
	let updateMock: ReturnType<typeof vi.fn>
	let connectorMock: ReturnType<typeof vi.fn>
	let tokenRefreshMock: ReturnType<typeof vi.fn>

	beforeEach(() => {
		findUniqueMock = database.session.findUnique as unknown as ReturnType<typeof vi.fn>
		deleteSessionMock = revoke as unknown as ReturnType<typeof vi.fn>
		updateMock = database.session.update as unknown as ReturnType<typeof vi.fn>
		connectorMock = connector as unknown as ReturnType<typeof vi.fn>

		vi.clearAllMocks()
	})

	it("should return null and log error if session does not exist", async () => {
		findUniqueMock.mockResolvedValue(null)

		const result = await retrieve(sessionId)

		expect(result).toBeNull()
		expect(logger.error).toHaveBeenCalledWith(`Session ${sessionId} does not exist`)
	})

	it("should return session if it exists and is not expired", async () => {
		const futureDate = moment().add(1, "hour").toDate()
		findUniqueMock.mockResolvedValue({ ...mockSession, accessExpiresAt: futureDate })

		const result = await retrieve(sessionId)

		expect(result).toEqual({ ...mockSession, accessExpiresAt: futureDate })
		expect(logger.error).not.toHaveBeenCalled()
	})

	it("should delete session and return null if expired and no refreshToken", async () => {
		const pastDate = moment().subtract(1, "hour").toDate()
		findUniqueMock.mockResolvedValue({ ...mockSession, accessExpiresAt: pastDate, refreshToken: null })

		const result = await retrieve(sessionId)

		expect(deleteSessionMock).toHaveBeenCalledWith(sessionId)
		expect(result).toBeNull()
	})

	it("should refresh session if expired and refreshToken exists", async () => {
		const pastDate = moment().subtract(1, "hour").toDate()
		findUniqueMock.mockResolvedValue({ ...mockSession, accessExpiresAt: pastDate })
		tokenRefreshMock = vi.fn().mockResolvedValue({ accessToken: "newToken", refreshToken: "newRefresh", accessExpiresAt: new Date() })
		connectorMock.mockReturnValue({ oAuthTokenRefresh: tokenRefreshMock })

		const result = await retrieve(sessionId)

		expect(logger.warn).toHaveBeenCalledWith(`Session ${sessionId} has expired, trying to refresh it...`)
		expect(tokenRefreshMock).toHaveBeenCalledWith(mockSession.refreshToken)
		expect(updateMock).toHaveBeenCalledWith({
			where: { id: sessionId },
			data: { accessToken: "newToken", refreshToken: "newRefresh", accessExpiresAt: expect.any(Date) }
		})
		expect(logger.info).toHaveBeenCalledWith(`Session ${sessionId} has been refreshed successfully`)
		expect(result).toEqual({ ...mockSession, accessExpiresAt: pastDate }) // function returns original session
	})

	it("should preserve old refreshToken if refresh returns null", async () => {
		const pastDate = moment().subtract(1, "hour").toDate()
		findUniqueMock.mockResolvedValue({ ...mockSession, accessExpiresAt: pastDate })
		tokenRefreshMock = vi.fn().mockResolvedValue({ accessToken: "newToken", refreshToken: null, accessExpiresAt: new Date() })
		connectorMock.mockReturnValue({ oAuthTokenRefresh: tokenRefreshMock })

		await retrieve(sessionId)

		expect(updateMock).toHaveBeenCalledWith({
			where: { id: sessionId },
			data: { accessToken: "newToken", refreshToken: mockSession.refreshToken, accessExpiresAt: expect.any(Date) }
		})
	})
})
