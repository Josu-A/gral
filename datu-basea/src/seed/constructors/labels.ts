import type { Etiketa } from "../../generated/client";
import type { SeededCategories } from "./categories";

import { labelData, type LabelKey } from "../data/labels";
import { logSeedBody, logSeedHeader, prisma } from "../utils";

type SeededLabels = Record<LabelKey, Etiketa>;

async function seedLabels(
    seededCategories: SeededCategories,
): Promise<SeededLabels> {
    logSeedHeader("Etiketak");

    const rows = await Promise.all(
        labelData.map(async ({ categoryKey, deskribapena, izena, key }) => {
            const etiketa = await prisma.etiketa.upsert({
                create: {
                    deskribapena,
                    izena,
                    kategoria_id: seededCategories[categoryKey].kategoria_id,
                },
                update: {},
                where: { izena },
            });
            return [key, etiketa] as const;
        }),
    );

    for (const row of rows) {
        logSeedBody(row[1].izena);
    }

    return Object.fromEntries(rows) as SeededLabels;
}

export default seedLabels;
export type { SeededLabels };
