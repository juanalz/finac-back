/*
  Warnings:

  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,0)`.

*/
-- CreateEnum
CREATE TYPE "public"."PaydayType" AS ENUM ('FIXED', 'LAST');

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,0);

-- CreateTable
CREATE TABLE "public"."pay_cycles" (
    "id" TEXT NOT NULL,
    "paydayType" "public"."PaydayType" NOT NULL,
    "paydayValue" INTEGER NOT NULL,
    "firstPaydate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pay_cycles_pkey" PRIMARY KEY ("id")
);
