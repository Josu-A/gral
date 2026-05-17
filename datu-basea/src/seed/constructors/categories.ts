import type { EtiketaKategoria } from "../../generated/client";

import { categoryData, type CategoryKey } from "../data/categories";
import { logSeedBody, logSeedHeader, prisma } from "../utils";

type SeededCategories = Record<CategoryKey, EtiketaKategoria>;

async function seedCategories(): Promise<SeededCategories> {
    logSeedHeader("Etiketa kategoriak");

    const rows = await Promise.all(
        categoryData.map(async ({ deskribapena, izena, key }) => {
            const etiketaKategoria = await prisma.etiketaKategoria.upsert({
                create: { deskribapena, izena },
                update: {},
                where: { izena },
            });
            return [key, etiketaKategoria] as const;
        }),
    );

    for (const row of rows) {
        logSeedBody(row[1].izena);
    }

    return Object.fromEntries(rows) as SeededCategories;
}

export default seedCategories;
export type { SeededCategories };
