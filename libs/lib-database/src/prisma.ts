import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

declare global {
	var prisma: PrismaClient | undefined
}

if (!global.prisma) {
	prisma = new PrismaClient({
		log: [ "query", "error", "warn" ]
	})
	global.prisma = prisma
} else {
	prisma = global.prisma
}

export default prisma
