import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { Dirent } from "fs"
import fs from "fs"
import { loadJobs } from "#/jobs/jobs"
import { logger } from "lib-logger"

vi.mock("lib-logger", () => ({
	logger: {
		level: vi.fn(),
		debug: vi.fn()
	}
}))

describe("loadJobs", () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let readdirSyncMock: ReturnType<typeof vi.spyOn<typeof fs, "readdirSync">>

	beforeEach(() => {
		readdirSyncMock = vi.spyOn(fs, "readdirSync")
		vi.spyOn(logger, "level").mockReturnValue("INFO")
		vi.spyOn(logger, "debug").mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("loads only .ts/.js files not starting with _", async () => {
		readdirSyncMock.mockReturnValue([
			{ name: "a.ts", isFile: () => true },
			{ name: "_b.ts", isFile: () => true },
			{ name: "c.js", isFile: () => true },
			{ name: "d.txt", isFile: () => true },
			{ name: "subdir", isFile: () => false }
		] as unknown as Dirent<NonSharedBuffer>[])

		const dynamicImport = vi.fn(async () => ({ cron: "* * * * *", task: vi.fn() }))

		const jobs = await loadJobs("mockDir", dynamicImport)
		expect(jobs.map(j => j.cron)).toEqual([ "* * * * *", "* * * * *" ])
		expect(dynamicImport).toHaveBeenCalledTimes(2)
	})

	it("throws if cron or task export is missing", async () => {
		readdirSyncMock.mockReturnValue([
			{ name: "bad.ts", isFile: () => true }
		] as unknown as Dirent<NonSharedBuffer>[])

		const dynamicImport = vi.fn(async () => ({ cron: "* * * * *" })) // task missing

		await expect(loadJobs("mockDir", dynamicImport)).rejects.toThrow(/Missing cron or task/)
	})

	it("executes task directly when logger level is not DEBUG", async () => {
		const taskMock = vi.fn()
		readdirSyncMock.mockReturnValue([ { name: "job.ts", isFile: () => true } ] as unknown as Dirent<NonSharedBuffer>[])
		const dynamicImport = vi.fn(async () => ({ cron: "* * * * *", task: taskMock }))

		const [ job ] = await loadJobs("mockDir", dynamicImport)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await job.task("param1", "param2")

		expect(taskMock).toHaveBeenCalledWith("param1", "param2")
	})

	it("wraps task with debug logs when logger level is DEBUG", async () => {
		vi.spyOn(logger, "level").mockReturnValue("DEBUG")
		const debugMock = vi.spyOn(logger, "debug")
		const taskMock = vi.fn()

		readdirSyncMock.mockReturnValue([ { name: "job.ts", isFile: () => true } ] as unknown as Dirent<NonSharedBuffer>[])
		const dynamicImport = vi.fn(async () => ({ cron: "* * * * *", task: taskMock }))

		const [ job ] = await loadJobs("mockDir", dynamicImport)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await job.task("param1")

		expect(debugMock).toHaveBeenCalledWith(expect.stringContaining("Executing job job"))
		expect(taskMock).toHaveBeenCalledWith("param1")
		expect(debugMock).toHaveBeenCalledWith(expect.stringMatching(/Finished job job \(\d+ms\)/))
	})

	it("uses the filename without extension as job name", async () => {
		readdirSyncMock.mockReturnValue([ { name: "hello-world.js", isFile: () => true } ] as unknown as Dirent<NonSharedBuffer>[])
		const taskMock = vi.fn()
		const dynamicImport = vi.fn(async () => ({ cron: "* * * * *", task: taskMock }))

		vi.spyOn(logger, "level").mockReturnValue("DEBUG")
		const debugMock = vi.spyOn(logger, "debug")

		const [ job ] = await loadJobs("mockDir", dynamicImport)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await job.task()

		expect(debugMock.mock.calls?.[0]?.[0]).toContain("hello-world")
	})
})
