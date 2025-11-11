-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('spotify', 'deezer');

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "platform" "Platform" NOT NULL DEFAULT 'spotify';
