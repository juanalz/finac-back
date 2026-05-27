CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

INSERT INTO "public"."users" ("id", "username", "passwordHash", "role")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin', 'finac-admin-salt:6166c31a79154781b2c9252eaa7864ba890f21c53d645cb7c5fa27036f874eed0e0cbf453c8e5fbc5b2a4eb7608110fb0d0cf56e46988984759447412051f5f9', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000002', 'user', 'finac-user-salt:c04899e37469f767fc36e827755c9d05c63eedd111b1c6bfb7872bc4565f5456fdc201ae25996204ed2a64eeab5311501d35362bd55051165087040b52129f43', 'USER')
ON CONFLICT ("username") DO NOTHING;

ALTER TABLE "public"."transactions" ADD COLUMN "userId" TEXT;
ALTER TABLE "public"."pay_cycles" ADD COLUMN "userId" TEXT;

ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."pay_cycles" ADD CONSTRAINT "pay_cycles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
