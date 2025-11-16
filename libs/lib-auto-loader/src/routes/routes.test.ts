import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import fs from "fs"
import type { Dirent } from "fs"
import { loadRoutes } from "#/routes/routes"
import { logger } from "lib-logger"
import { sessions } from "lib-session"

vi.mock("lib-logger", () => ({
	logger: {
		level: vi.fn(),
		debug: vi.fn(),
		error: vi.fn()
	}
}))

vi.mock("lib-session", () => ({
	sessions: {
		retrieve: vi.fn()
	}
}))

describe("loadRoutes", () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let readdirSyncMock: ReturnType<typeof vi.spyOn<typeof fs, "readdirSync">>

	beforeEach(() => {
		readdirSyncMock = vi.spyOn(fs, "readdirSync")
		vi.spyOn(logger, "level").mockReturnValue("INFO")
		vi.spyOn(logger, "debug").mockImplementation(() => {})
		vi.spyOn(logger, "error").mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("loads only .ts/.js files not starting with _ and directories recursively", async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		readdirSyncMock.mockImplementation((dir: string) => {
			if (dir === "mockDir") return [
				{ name: "get.ts", isFile: () => true, isDirectory: () => false },
				{ name: "_private", isFile: () => false, isDirectory: () => true },
				{ name: "subdir", isFile: () => false, isDirectory: () => true }
			] as unknown as Dirent[]
			if (dir === "mockDir/subdir") return [
				{ name: "post.js", isFile: () => true, isDirectory: () => false }
			] as unknown as Dirent[]
			return []
		})

		const dynamicImport = vi.fn(async () => ({ schema: {}, handler: vi.fn() }))

		const routes = await loadRoutes("mockDir", "", dynamicImport)

		expect(routes.map(r => r.method)).toEqual(expect.arrayContaining([ "GET", "POST" ]))
		expect(dynamicImport).toHaveBeenCalledTimes(2)
	})

	it("throws if schema or handler export is missing", async () => {
		readdirSyncMock.mockReturnValue([
			{ name: "bad.ts", isFile: () => true, isDirectory: () => false }
		] as unknown as Dirent<NonSharedBuffer>[])

		const dynamicImport = vi.fn(async () => ({ schema: {} })) // handler missing
		await expect(loadRoutes("mockDir", "", dynamicImport)).rejects.toThrow(/Missing schema or handler/)
	})

	it("wraps handler with debug logs when logger level is DEBUG", async () => {
		vi.spyOn(logger, "level").mockReturnValue("DEBUG")
		const debugMock = vi.spyOn(logger, "debug")

		readdirSyncMock.mockReturnValue([
			{ name: "get.ts", isFile: () => true, isDirectory: () => false }
		] as unknown as Dirent<NonSharedBuffer>[])

		const handlerMock = vi.fn()
		const dynamicImport = vi.fn(async () => ({ schema: {}, handler: handlerMock }))

		const [ route ] = await loadRoutes("mockDir", "", dynamicImport)
		const replyMock = { code: vi.fn().mockReturnThis(), send: vi.fn() }
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await route.handler({ cookies: {} }, replyMock)

		expect(debugMock).toHaveBeenCalledWith(expect.stringContaining("Entering GET /"))
		expect(handlerMock).toHaveBeenCalled()
		expect(debugMock).toHaveBeenCalledWith(expect.stringMatching(/Leaving GET \/ \(\d+ms\)/))
	})

	it("handles auth schema with missing or invalid session", async () => {
		readdirSyncMock.mockReturnValue([
			{ name: "post.ts", isFile: () => true, isDirectory: () => false }
		] as unknown as Dirent<NonSharedBuffer>[])

		const dynamicImport = vi.fn(async () => ({ schema: { auth: true }, handler: vi.fn() }))
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		sessions.retrieve.mockResolvedValue(null)

		const [ route ] = await loadRoutes("mockDir", "", dynamicImport)
		const replyMock = { code: vi.fn().mockReturnThis(), send: vi.fn() }

		// no cookie
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await route.handler({ cookies: {} }, replyMock)
		expect(replyMock.code).toHaveBeenCalledWith(401)
		expect(replyMock.send).toHaveBeenCalledWith({ message: "Session ID cookie not present" })

		// session_id present but session not found
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await route.handler({ cookies: { session_id: "123" } }, replyMock)
		expect(sessions.retrieve).toHaveBeenCalledWith("123")
		expect(replyMock.code).toHaveBeenCalledWith(401)
	})

	it("catches errors in handler and returns 500", async () => {
		readdirSyncMock.mockReturnValue([
			{ name: "get.ts", isFile: () => true, isDirectory: () => false }
		] as unknown as Dirent<NonSharedBuffer>[])

		const dynamicImport = vi.fn(async () => ({
			schema: {},
			handler: vi.fn(() => { throw new Error("fail") })
		}))

		const [ route ] = await loadRoutes("mockDir", "", dynamicImport)
		const replyMock = { code: vi.fn().mockReturnThis(), send: vi.fn() }

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await route.handler({ cookies: {} }, replyMock)
		expect(replyMock.code).toHaveBeenCalledWith(500)
		expect(replyMock.send).toHaveBeenCalledWith({ message: "Internal server error" })
		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("Error in GET /: fail"))
	})
})
