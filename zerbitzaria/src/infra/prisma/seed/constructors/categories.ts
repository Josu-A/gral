import type {
    EtiketaKategoria
} from "@infra/prisma/generated/client";

import {
    categoryData,
    type CategoryKey
} from "@infra/prisma/seed/data/categories"
import { logSeedBody, logSeedHeader, prisma } from "@infra/prisma/seed/utils";

type SeededCategories = Record<CategoryKey, EtiketaKategoria>

async function seedCategories(): Promise<SeededCategories> {
    logSeedHeader('Etiketa kategoriak');

    const rows = await Promise.all(
        categoryData.map(async ({ deskribapena, izena, key }) => {
            const etiketaKategoria = await prisma.etiketaKategoria.upsert({
                create: { deskribapena, izena },
                update: {},
                where: { izena }
            });
            return [key, etiketaKategoria] as const;
        })
    );

    for (const row of rows) {
        logSeedBody(row[1].izena);
    }

    return Object.fromEntries(rows) as SeededCategories;
};

export default seedCategories;
export type {
    SeededCategories
};
