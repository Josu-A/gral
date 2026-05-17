/*
  Warnings:

  - Added the required column `fitxategi_izena` to the `testa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testa" ADD COLUMN     "fitxategi_izena" VARCHAR(255) NOT NULL;
