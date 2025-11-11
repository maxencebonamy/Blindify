import { env } from "#/env"
import { PrismaClient } from "#/generated/client"

const extendedPrisma = new PrismaClient()

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClient
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? extendedPrisma

if (env.APP_ENV !== "production") {
	globalForPrisma.prisma = prisma
}
