import type {
    Etiketa
} from "@infra/prisma/generated/client";
import type { SeededCategories } from "@infra/prisma/seed/constructors/categories";

import {
    labelData,
    type LabelKey
} from "@infra/prisma/seed/data/labels"
import { logSeedBody, logSeedHeader, prisma } from "@infra/prisma/seed/utils";

type SeededLabels = Record<LabelKey, Etiketa>

async function seedLabels(seededCategories: SeededCategories): Promise<SeededLabels> {
    logSeedHeader('Etiketak');

    const rows = await Promise.all(
        labelData.map(async ({ categoryKey, deskribapena, izena, key }) => {
            const etiketa = await prisma.etiketa.upsert({
                create: {
                    deskribapena,
                    izena,
                    kategoria_id: seededCategories[categoryKey].kategoria_id
                },
                update: {},
                where: { izena }
            });
            return [key, etiketa] as const;
        })
    );

    for (const row of rows) {
        logSeedBody(row[1].izena);
    }

    return Object.fromEntries(rows) as SeededLabels;
};

export default seedLabels;
export type {
    SeededLabels
};
