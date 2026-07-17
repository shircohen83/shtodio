/*
  Warnings:

  - You are about to drop the column `fullName` on the `Client` table. All the data in the column will be lost.
  - Added the required column `kidName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Made the column `kidAge` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "kidName" TEXT NOT NULL,
    "kidAge" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("createdAt", "email", "id", "kidAge", "phone") SELECT "createdAt", "email", "id", "kidAge", "phone" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_username_key" ON "Client"("username");
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
