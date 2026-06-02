import { join } from "node:path";

import type { Ariketa } from "../../generated/client";
import type { SeededLabels } from "./labels";
import type { SeededProgrammingLanguages } from "./programmingLanguages";

import { exerciseData, type ExerciseKey } from "../data/exercises";
import { logSeedBody, logSeedHeader, prisma, readSeed } from "../utils";

type SeededExercises = Record<ExerciseKey, Ariketa>;

async function seedExercises(
    seededProgrammingLanguages: SeededProgrammingLanguages,
    seededLabels: SeededLabels,
): Promise<SeededExercises> {
    logSeedHeader("Ariketak");

    const rows = await Promise.all(
        exerciseData.map(async (data) => {
            const exerciseFolderName = data.key
                .split(/(?=[A-Z])/)
                .join("-")
                .toLowerCase();
            const exerciseFolder = join(
                "data",
                "exercises",
                exerciseFolderName,
            );

            const statement = await readSeed(exerciseFolder, data.enuntziatua);
            const ariketa = await prisma.ariketa.upsert({
                create: {
                    enuntziatua: statement,
                    etiketak: {
                        create: data.labelKeys.map((label) => ({
                            etiketa_id: seededLabels[label].etiketa_id,
                        })),
                    },
                    izenburua: data.izenburua,
                    zailtasun_maila: data.zailtasun_maila,
                },
                update: {},
                where: {
                    izenburua: data.izenburua,
                },
            });
            logSeedBody(ariketa.izenburua);

            for (const specificData of data.specificExercises) {
                const specificExercisePath = join(
                    exerciseFolder,
                    specificData.programmingLanguageKey,
                );
                const srcPath = join(specificExercisePath, "src");
                const testsPath = join(specificExercisePath, "tests");
                const programazioLengoaia =
                    seededProgrammingLanguages[
                        specificData.programmingLanguageKey
                    ];

                const tests = await Promise.all(
                    specificData.tests.map(async (test) => ({
                        fitxategi_izena: test.testa_kodea,
                        izena: test.izena,
                        ordena: test.ordena,
                        pisua: test.pisua,
                        testa_kodea: await readSeed(
                            testsPath,
                            test.testa_kodea,
                        ),
                        timeout: test.timeout,
                    })),
                );

                const headerFile =
                    "buru_fitxategia" in specificData &&
                    specificData.buru_fitxategia
                        ? await readSeed(srcPath, specificData.buru_fitxategia)
                        : null;

                await prisma.ariketaZehatza.upsert({
                    create: {
                        ariketa_id: ariketa.ariketa_id,
                        buru_fitxategia: headerFile,
                        erreferentzia_emaitza: await readSeed(
                            srcPath,
                            specificData.erreferentzia_emaitza,
                        ),
                        funtzio_izena: specificData.funtzio_izena,
                        hasierako_kodea: await readSeed(
                            srcPath,
                            specificData.hasierako_kodea,
                        ),
                        programazio_lengoaia_id:
                            programazioLengoaia.programazio_lengoaia_id,
                        testak: {
                            create: tests,
                        },
                    },
                    update: {},
                    where: {
                        ariketa_id_programazio_lengoaia_id: {
                            ariketa_id: ariketa.ariketa_id,
                            programazio_lengoaia_id:
                                programazioLengoaia.programazio_lengoaia_id,
                        },
                    },
                });
                logSeedBody(
                    `${ariketa.izenburua} - ${programazioLengoaia.izena} ${programazioLengoaia.bertsioa}`,
                );
            }
            return [data.key, ariketa];
        }),
    );

    return Object.fromEntries(rows) as SeededExercises;
}

export default seedExercises;
export type { SeededExercises };
