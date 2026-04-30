/*
  Warnings:

  - Added the required column `lastPayDate` to the `pay_cycles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."pay_cycles" ADD COLUMN     "lastPayDate" TEXT NOT NULL;
