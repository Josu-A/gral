import type {
    ProgramazioLengoaia
} from "@infra/prisma/generated/client";

import {
    programmingLanguageData,
    type ProgrammingLanguageKey
} from "@infra/prisma/seed/data/programmingLanguages"
import { logSeedBody, logSeedHeader, prisma } from "@infra/prisma/seed/utils";

type SeededProgrammingLanguages = Record<ProgrammingLanguageKey, ProgramazioLengoaia>

async function seedProgrammingLanguages(): Promise<SeededProgrammingLanguages> {
    logSeedHeader('Programazio lengoaiak');

    const rows = await Promise.all(
        programmingLanguageData.map(async ({ bertsioa, izena, key }) => {
            const programazioLengoaia = await prisma.programazioLengoaia.upsert({
                create: { bertsioa, izena },
                update: {},
                where: { izena_bertsioa: { bertsioa, izena } }
            });
            return [key, programazioLengoaia] as const;
        })
    );

    for (const row of rows) {
        logSeedBody(`${row[1].izena} ${row[1].bertsioa}`);
    }

    return Object.fromEntries(rows) as SeededProgrammingLanguages;
};

export default seedProgrammingLanguages;
export type {
    SeededProgrammingLanguages
};
