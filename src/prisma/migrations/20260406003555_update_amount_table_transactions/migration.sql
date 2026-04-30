/*
  Warnings:

  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,0)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);
