/*
  Warnings:

  - The values [PENDING,LATE] on the enum `BorrowingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `returned` column on the `borrowings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."BorrowingStatus_new" AS ENUM ('BORROWED', 'RETURNED', 'OVERDUE');
ALTER TABLE "public"."borrowings" ALTER COLUMN "status" TYPE "public"."BorrowingStatus_new" USING ("status"::text::"public"."BorrowingStatus_new");
ALTER TYPE "public"."BorrowingStatus" RENAME TO "BorrowingStatus_old";
ALTER TYPE "public"."BorrowingStatus_new" RENAME TO "BorrowingStatus";
DROP TYPE "public"."BorrowingStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."borrowings" ADD COLUMN     "status" "public"."BorrowingStatus" NOT NULL DEFAULT 'BORROWED',
DROP COLUMN "returned",
ADD COLUMN     "returned" TIMESTAMP(3);

UPDATE "Borrowing" SET status = 'BORROWED' WHERE status = 'PENDING';
UPDATE "Borrowing" SET status = 'BORROWED' WHERE status = 'LATE';
-- 1. enumdagi qiymatni ishlatayotgan borrows yo‘qligini tekshiring
SELECT * FROM "Borrowing" WHERE status IN ('PENDING', 'LATE');
