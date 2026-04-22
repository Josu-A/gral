import type {
    LastAttempts,
    SolvedSolutions
} from '@domain/dashboard/local/types/schemas';

import db from '@infra/db';
import { Egoera, Zailtasuna } from "@infra/prisma/generated/enums";

async function getAverageGrade(erabiltzailea_id: number): Promise<number> {
    const bestAttemptPerSolution = await db.saiakera.groupBy({
        _max: {
            nota: true
        },
        by: ['ebazpena_id'],
        where: {
            ebazpena: {
                egoera: {
                    not: Egoera.Hutsik
                },
                erabiltzailea_id
            }
        }
    });
    const bestGrades = bestAttemptPerSolution
        .map((attempt) => attempt._max.nota)
        .filter((nota): nota is number => nota !== null);

    if (bestGrades.length === 0) {
        return 0;
    }
    const total = bestGrades.reduce((sum, nota) => sum + nota, 0);
    return total / bestGrades.length;
}

async function getLastAttempts(
    erabiltzailea_id: number,
    amount: number = 5
): Promise<LastAttempts> {
    const attempts = await db.saiakera.findMany({
        orderBy: {
            denbora_zigilua: 'desc'
        },
        select: {
            denbora_zigilua: true,
            ebazpena: {
                select: {
                    ariketa_zehatza: {
                        select: {
                            ariketa_id: true,
                            programazio_lengoaia: {
                                select: {
                                    izena: true
                                }
                            }
                        }
                    }
                }
            },
            nota: true,
            saiakera_id: true
        },
        take: amount,
        where: {
            ebazpena: {
                egoera: {
                    not: Egoera.Hutsik
                },
                erabiltzailea_id
            }
        }
    });
    return attempts.map(attempt => ({
        ariketa_id: attempt.ebazpena.ariketa_zehatza.ariketa_id,
        denbora_zigilua: attempt.denbora_zigilua,
        nota: attempt.nota,
        programazio_lengoaia_izena: attempt.ebazpena.ariketa_zehatza.programazio_lengoaia.izena,
        saiakera_id: attempt.saiakera_id
    }));
}

async function getSolvedSolutions(erabiltzailea_id: number): Promise<SolvedSolutions> {
    const solveSolutionsCounts: SolvedSolutions = {
        aurreratua: 0,
        ertaina: 0,
        hasiberria: 0
    };

    const solvedSolutions = await db.ebazpena.findMany({
        select: {
            ariketa_zehatza: {
                select: {
                    ariketa: {
                        select: {
                            zailtasun_maila: true
                        }
                    }
                }
            }
        },
        where: {
            egoera: Egoera.Gaindituta,
            erabiltzailea_id
        }
    });

    for (const solvedSolution of solvedSolutions) {
        switch (solvedSolution.ariketa_zehatza.ariketa.zailtasun_maila) {
            case Zailtasuna.Erraza:
                solveSolutionsCounts.hasiberria += 1;
                break;
            case Zailtasuna.Ertaina:
                solveSolutionsCounts.ertaina += 1;
                break;
            case Zailtasuna.Zaila:
                solveSolutionsCounts.aurreratua += 1;
                break;
        }
    }

    return solveSolutionsCounts;
}

async function getTotalSolvedSolutions(erabiltzailea_id: number): Promise<number> {
    return await db.ebazpena.count({
        where: {
            egoera: Egoera.Gaindituta,
            erabiltzailea_id
        }
    });
}


export default {
    getAverageGrade,
    getLastAttempts,
    getSolvedSolutions,
    getTotalSolvedSolutions
} as const;