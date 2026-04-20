-- CreateEnum
CREATE TYPE "Egoera" AS ENUM ('Hutsik', 'Hasita', 'Gaindituta');

-- CreateEnum
CREATE TYPE "Jabea" AS ENUM ('Erabiltzailea', 'AA');

-- CreateEnum
CREATE TYPE "Zailtasuna" AS ENUM ('Erraza', 'Ertaina', 'Zaila');

-- CreateEnum
CREATE TYPE "IkasketaMaila" AS ENUM ('Hasiberria', 'Ertaina', 'Aurreratua');

-- CreateTable
CREATE TABLE "ebazpena" (
    "ebazpena_id" SERIAL NOT NULL,
    "erabiltzailea_id" INTEGER NOT NULL,
    "ariketa_zehatza_id" INTEGER NOT NULL,
    "egoera" "Egoera" NOT NULL DEFAULT 'Hutsik',
    "kodea" TEXT,

    CONSTRAINT "ebazpena_pkey" PRIMARY KEY ("ebazpena_id")
);

-- CreateTable
CREATE TABLE "mezua" (
    "mezua_id" SERIAL NOT NULL,
    "ebazpena_id" INTEGER NOT NULL,
    "denbora_zigilua" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edukia" TEXT NOT NULL,
    "jabea" "Jabea" NOT NULL,

    CONSTRAINT "mezua_pkey" PRIMARY KEY ("mezua_id")
);

-- CreateTable
CREATE TABLE "saiakera" (
    "saiakera_id" SERIAL NOT NULL,
    "ebazpena_id" INTEGER NOT NULL,
    "saiakera_kodea" TEXT NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "denbora_zigilua" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saiakera_pkey" PRIMARY KEY ("saiakera_id")
);

-- CreateTable
CREATE TABLE "exekuzioa" (
    "exekuzioa_id" SERIAL NOT NULL,
    "saiakera_id" INTEGER NOT NULL,
    "testa_id" INTEGER NOT NULL,
    "zuzena" BOOLEAN NOT NULL,
    "emaitza" TEXT NOT NULL,
    "exekuzio_denbora" INTEGER NOT NULL,

    CONSTRAINT "exekuzioa_pkey" PRIMARY KEY ("exekuzioa_id")
);

-- CreateTable
CREATE TABLE "etiketa_kategoria" (
    "kategoria_id" SERIAL NOT NULL,
    "izena" VARCHAR(100) NOT NULL,
    "deskribapena" TEXT NOT NULL,

    CONSTRAINT "etiketa_kategoria_pkey" PRIMARY KEY ("kategoria_id")
);

-- CreateTable
CREATE TABLE "etiketa" (
    "etiketa_id" SERIAL NOT NULL,
    "izena" VARCHAR(100) NOT NULL,
    "deskribapena" TEXT NOT NULL,
    "kategoria_id" INTEGER NOT NULL,

    CONSTRAINT "etiketa_pkey" PRIMARY KEY ("etiketa_id")
);

-- CreateTable
CREATE TABLE "ariketa" (
    "ariketa_id" SERIAL NOT NULL,
    "izenburua" VARCHAR(255) NOT NULL,
    "enuntziatua" TEXT NOT NULL,
    "zailtasun_maila" "Zailtasuna" NOT NULL,

    CONSTRAINT "ariketa_pkey" PRIMARY KEY ("ariketa_id")
);

-- CreateTable
CREATE TABLE "ariketa_etiketa" (
    "ariketa_id" INTEGER NOT NULL,
    "etiketa_id" INTEGER NOT NULL,

    CONSTRAINT "ariketa_etiketa_pkey" PRIMARY KEY ("ariketa_id","etiketa_id")
);

-- CreateTable
CREATE TABLE "ariketa_zehatza" (
    "ariketa_zehatza_id" SERIAL NOT NULL,
    "ariketa_id" INTEGER NOT NULL,
    "programazio_lengoaia_id" INTEGER NOT NULL,
    "funtzio_izena" VARCHAR(255) NOT NULL,
    "hasierako_kodea" TEXT NOT NULL,
    "erreferentzia_emaitza" TEXT NOT NULL,
    "saiakera_fitxategia" TEXT NOT NULL,
    "buru_fitxategia" TEXT,

    CONSTRAINT "ariketa_zehatza_pkey" PRIMARY KEY ("ariketa_zehatza_id")
);

-- CreateTable
CREATE TABLE "testa" (
    "testa_id" SERIAL NOT NULL,
    "ariketa_zehatza_id" INTEGER NOT NULL,
    "izena" VARCHAR(255) NOT NULL,
    "testa_kodea" TEXT NOT NULL,
    "ordena" INTEGER NOT NULL,
    "pisua" INTEGER NOT NULL DEFAULT 1,
    "timeout" INTEGER NOT NULL DEFAULT 5000,

    CONSTRAINT "testa_pkey" PRIMARY KEY ("testa_id")
);

-- CreateTable
CREATE TABLE "programazio_lengoaia" (
    "programazio_lengoaia_id" SERIAL NOT NULL,
    "izena" VARCHAR(255) NOT NULL,
    "bertsioa" VARCHAR(100) NOT NULL,

    CONSTRAINT "programazio_lengoaia_pkey" PRIMARY KEY ("programazio_lengoaia_id")
);

-- CreateTable
CREATE TABLE "erabiltzailea" (
    "erabiltzailea_id" SERIAL NOT NULL,
    "izena" VARCHAR(255) NOT NULL,
    "helbide_elektronikoa" VARCHAR(255) NOT NULL,
    "pasahitza" VARCHAR(255) NOT NULL,
    "sortze_data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktibatuta" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "erabiltzailea_pkey" PRIMARY KEY ("erabiltzailea_id")
);

-- CreateTable
CREATE TABLE "ikaslea" (
    "erabiltzailea_id" INTEGER NOT NULL,
    "ikasketa_maila" "IkasketaMaila" NOT NULL,
    "gogoko_lengoaia_id" INTEGER,

    CONSTRAINT "ikaslea_pkey" PRIMARY KEY ("erabiltzailea_id")
);

-- CreateTable
CREATE TABLE "freskatze_tokena" (
    "id" SERIAL NOT NULL,
    "erabiltzailea_id" INTEGER NOT NULL,
    "tokena" TEXT NOT NULL,
    "tokena_id" TEXT NOT NULL,
    "iraungipen_data" TIMESTAMP(3) NOT NULL,
    "iraungitutako_data" TIMESTAMP(3),
    "ordezkapena" TEXT,
    "sortze_data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_helbidea" INET NOT NULL,
    "gailu_mota" TEXT NOT NULL,

    CONSTRAINT "freskatze_tokena_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ebazpena_erabiltzailea_id_idx" ON "ebazpena"("erabiltzailea_id");

-- CreateIndex
CREATE INDEX "ebazpena_ariketa_zehatza_id_idx" ON "ebazpena"("ariketa_zehatza_id");

-- CreateIndex
CREATE INDEX "ebazpena_egoera_idx" ON "ebazpena"("egoera");

-- CreateIndex
CREATE UNIQUE INDEX "ebazpena_erabiltzailea_id_ariketa_zehatza_id_key" ON "ebazpena"("erabiltzailea_id", "ariketa_zehatza_id");

-- CreateIndex
CREATE INDEX "mezua_ebazpena_id_idx" ON "mezua"("ebazpena_id");

-- CreateIndex
CREATE INDEX "saiakera_ebazpena_id_idx" ON "saiakera"("ebazpena_id");

-- CreateIndex
CREATE INDEX "exekuzioa_saiakera_id_idx" ON "exekuzioa"("saiakera_id");

-- CreateIndex
CREATE INDEX "exekuzioa_testa_id_idx" ON "exekuzioa"("testa_id");

-- CreateIndex
CREATE UNIQUE INDEX "etiketa_kategoria_izena_key" ON "etiketa_kategoria"("izena");

-- CreateIndex
CREATE UNIQUE INDEX "etiketa_izena_key" ON "etiketa"("izena");

-- CreateIndex
CREATE INDEX "etiketa_kategoria_id_idx" ON "etiketa"("kategoria_id");

-- CreateIndex
CREATE UNIQUE INDEX "ariketa_izenburua_key" ON "ariketa"("izenburua");

-- CreateIndex
CREATE INDEX "ariketa_zailtasun_maila_idx" ON "ariketa"("zailtasun_maila");

-- CreateIndex
CREATE INDEX "ariketa_etiketa_etiketa_id_idx" ON "ariketa_etiketa"("etiketa_id");

-- CreateIndex
CREATE INDEX "ariketa_zehatza_programazio_lengoaia_id_idx" ON "ariketa_zehatza"("programazio_lengoaia_id");

-- CreateIndex
CREATE UNIQUE INDEX "ariketa_zehatza_ariketa_id_programazio_lengoaia_id_key" ON "ariketa_zehatza"("ariketa_id", "programazio_lengoaia_id");

-- CreateIndex
CREATE UNIQUE INDEX "testa_ariketa_zehatza_id_izena_key" ON "testa"("ariketa_zehatza_id", "izena");

-- CreateIndex
CREATE UNIQUE INDEX "programazio_lengoaia_izena_bertsioa_key" ON "programazio_lengoaia"("izena", "bertsioa");

-- CreateIndex
CREATE UNIQUE INDEX "erabiltzailea_helbide_elektronikoa_key" ON "erabiltzailea"("helbide_elektronikoa");

-- CreateIndex
CREATE INDEX "erabiltzailea_helbide_elektronikoa_idx" ON "erabiltzailea"("helbide_elektronikoa");

-- CreateIndex
CREATE UNIQUE INDEX "freskatze_tokena_tokena_key" ON "freskatze_tokena"("tokena");

-- CreateIndex
CREATE INDEX "freskatze_tokena_erabiltzailea_id_idx" ON "freskatze_tokena"("erabiltzailea_id");

-- CreateIndex
CREATE INDEX "freskatze_tokena_tokena_id_idx" ON "freskatze_tokena"("tokena_id");

-- CreateIndex
CREATE INDEX "freskatze_tokena_iraungipen_data_idx" ON "freskatze_tokena"("iraungipen_data");

-- AddForeignKey
ALTER TABLE "ebazpena" ADD CONSTRAINT "ebazpena_erabiltzailea_id_fkey" FOREIGN KEY ("erabiltzailea_id") REFERENCES "ikaslea"("erabiltzailea_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ebazpena" ADD CONSTRAINT "ebazpena_ariketa_zehatza_id_fkey" FOREIGN KEY ("ariketa_zehatza_id") REFERENCES "ariketa_zehatza"("ariketa_zehatza_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mezua" ADD CONSTRAINT "mezua_ebazpena_id_fkey" FOREIGN KEY ("ebazpena_id") REFERENCES "ebazpena"("ebazpena_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saiakera" ADD CONSTRAINT "saiakera_ebazpena_id_fkey" FOREIGN KEY ("ebazpena_id") REFERENCES "ebazpena"("ebazpena_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exekuzioa" ADD CONSTRAINT "exekuzioa_saiakera_id_fkey" FOREIGN KEY ("saiakera_id") REFERENCES "saiakera"("saiakera_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exekuzioa" ADD CONSTRAINT "exekuzioa_testa_id_fkey" FOREIGN KEY ("testa_id") REFERENCES "testa"("testa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiketa" ADD CONSTRAINT "etiketa_kategoria_id_fkey" FOREIGN KEY ("kategoria_id") REFERENCES "etiketa_kategoria"("kategoria_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ariketa_etiketa" ADD CONSTRAINT "ariketa_etiketa_ariketa_id_fkey" FOREIGN KEY ("ariketa_id") REFERENCES "ariketa"("ariketa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ariketa_etiketa" ADD CONSTRAINT "ariketa_etiketa_etiketa_id_fkey" FOREIGN KEY ("etiketa_id") REFERENCES "etiketa"("etiketa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ariketa_zehatza" ADD CONSTRAINT "ariketa_zehatza_ariketa_id_fkey" FOREIGN KEY ("ariketa_id") REFERENCES "ariketa"("ariketa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ariketa_zehatza" ADD CONSTRAINT "ariketa_zehatza_programazio_lengoaia_id_fkey" FOREIGN KEY ("programazio_lengoaia_id") REFERENCES "programazio_lengoaia"("programazio_lengoaia_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testa" ADD CONSTRAINT "testa_ariketa_zehatza_id_fkey" FOREIGN KEY ("ariketa_zehatza_id") REFERENCES "ariketa_zehatza"("ariketa_zehatza_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ikaslea" ADD CONSTRAINT "ikaslea_erabiltzailea_id_fkey" FOREIGN KEY ("erabiltzailea_id") REFERENCES "erabiltzailea"("erabiltzailea_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ikaslea" ADD CONSTRAINT "ikaslea_gogoko_lengoaia_id_fkey" FOREIGN KEY ("gogoko_lengoaia_id") REFERENCES "programazio_lengoaia"("programazio_lengoaia_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freskatze_tokena" ADD CONSTRAINT "freskatze_tokena_erabiltzailea_id_fkey" FOREIGN KEY ("erabiltzailea_id") REFERENCES "erabiltzailea"("erabiltzailea_id") ON DELETE CASCADE ON UPDATE CASCADE;
