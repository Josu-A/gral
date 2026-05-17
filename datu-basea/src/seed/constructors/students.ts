import type { Erabiltzailea } from "../../generated/client";
import type { Student, Students } from "../data/students/types";
import type { SeededProgrammingLanguages } from "./programmingLanguages";

import { environment } from "../../env";
import {
    studentData,
    type StudentKey,
    testingStudentData,
    type TestingStudentKey,
} from "../data/students";
import { logSeedBody, logSeedHeader, prisma } from "../utils";

type SeededStudents = Record<StudentKey | TestingStudentKey, Erabiltzailea>;

async function _seedStudents(
    seededProgrammingLanguages: SeededProgrammingLanguages,
    envData: Students,
): Promise<SeededStudents> {
    logSeedHeader("Ikasleak");

    const rows = await Promise.all(
        envData.map(async (data) => {
            const erabiltzailea = await prisma.erabiltzailea.upsert({
                create: {
                    aktibatuta: data.aktibatuta,
                    helbide_elektronikoa: data.helbide_elektronikoa,
                    ikaslea: {
                        create: {
                            gogoko_lengoaia_id:
                                seededProgrammingLanguages[
                                    data.gogoko_lengoaia_id
                                ].programazio_lengoaia_id,
                            ikasketa_maila: data.ikasketa_maila,
                        },
                    },
                    izena: data.izena,
                    pasahitza: data.pasahitza,
                },
                update: {},
                where: {
                    helbide_elektronikoa: data.helbide_elektronikoa,
                },
            });
            return [data.key, erabiltzailea] as const;
        }),
    );

    for (const row of rows) {
        logSeedBody(row[1].helbide_elektronikoa);
    }

    return Object.fromEntries(rows) as SeededStudents;
}

async function seedStudents(
    seededProgrammingLanguages: SeededProgrammingLanguages,
): Promise<SeededStudents> {
    const data: Student[] = [...studentData];
    if (environment.NODE_ENV === "development") {
        data.push(...testingStudentData);
    }
    return await _seedStudents(seededProgrammingLanguages, testingStudentData);
}

export default seedStudents;
export type { SeededStudents };
