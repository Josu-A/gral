import type {
    GetCategoryResponse,
    GetExerciseResponse,
    GetProgrammingLanguagesResponse,
    GetSpecificExerciseResponse,
    GetTagResponse,
    IListExercises,
    ListedAriketa,
} from "@domain/exercises/local/types/schemas";
import type { Prisma } from "@gral/datu-basea";

import db from "@gral/datu-basea";
import { Egoera } from "@gral/datu-basea";

async function getCategories(): Promise<GetCategoryResponse[]> {
    return await db.etiketaKategoria.findMany({
        orderBy: { izena: "asc" },
        select: {
            deskribapena: true,
            izena: true,
            kategoria_id: true,
        },
    });
}

async function getExercise(
    ariketa_id: number,
    erabiltzailea_id: number,
    programazio_lengoaia_id: null | number,
): Promise<GetExerciseResponse | null> {
    const exercise = await db.ariketa.findUnique({
        select: {
            ariketa_zehatzak: {
                select: {
                    ariketa_zehatza_id: true,
                    ebazpenak: {
                        select: {
                            ebazpena_id: true,
                            kodea: true,
                        },
                        where: {
                            erabiltzailea_id,
                        },
                    },
                    hasierako_kodea: true,
                    programazio_lengoaia: {
                        select: {
                            bertsioa: true,
                            izena: true,
                            programazio_lengoaia_id: true,
                        },
                    },
                    programazio_lengoaia_id: true,
                },
            },
            enuntziatua: true,
            etiketak: {
                select: {
                    etiketa: {
                        select: {
                            izena: true,
                        },
                    },
                },
            },
            izenburua: true,
            zailtasun_maila: true,
        },
        where: { ariketa_id },
    });

    if (!exercise) {
        return null;
    }

    let chosenSpecificExercise = null;
    if (programazio_lengoaia_id) {
        chosenSpecificExercise =
            exercise.ariketa_zehatzak.find(
                (specific_exercise) =>
                    specific_exercise.programazio_lengoaia_id ===
                    programazio_lengoaia_id,
            ) ?? null;
    }
    if (!chosenSpecificExercise && exercise.ariketa_zehatzak.length > 0) {
        chosenSpecificExercise = exercise.ariketa_zehatzak[0];
    }

    const ikasle_kodea = chosenSpecificExercise?.ebazpenak?.[0]?.kodea ?? null;

    const processedSpecificExercises = exercise.ariketa_zehatzak.map(
        (specific_exercise) => {
            const { ebazpenak, ...rest } = specific_exercise;
            return {
                ...rest,
                ebazpenak: ebazpenak.map(({ ebazpena_id }) => ({
                    ebazpena_id,
                })),
            };
        },
    );

    const processedChosenSpecificExercise = chosenSpecificExercise
        ? {
              ...chosenSpecificExercise,
              ebazpenak: chosenSpecificExercise.ebazpenak.map(
                  ({ ebazpena_id }) => ({ ebazpena_id }),
              ),
          }
        : null;

    return {
        ariketa: {
            ...exercise,
            ariketa_zehatzak: processedSpecificExercises,
        },
        ariketa_zehatza: processedChosenSpecificExercise,
        ikasle_kodea,
    };
}

async function getExercises(
    erabiltzailea_id: number,
    filters: IListExercises,
): Promise<ListedAriketa[]> {
    const {
        egoerak,
        etiketa_ids,
        etiketa_ids_mode,
        etiketa_kategoria_ids,
        etiketa_kategoria_ids_mode,
        programazio_lengoaia_ids,
        programazio_lengoaia_ids_mode,
        titulua,
        zailtasunak,
    } = filters;

    const andConditions: Prisma.AriketaWhereInput[] = [];

    if (titulua) {
        andConditions.push({
            izenburua: { contains: titulua, mode: "insensitive" },
        });
    }

    if (egoerak.length > 0) {
        const orStatusConditions = egoerak.map((egoera) =>
            returnFilterByExerciseStatus(egoera, erabiltzailea_id),
        );
        andConditions.push(
            orStatusConditions.length === 1
                ? orStatusConditions[0]
                : { OR: orStatusConditions },
        );
    }

    if (zailtasunak.length > 0) {
        andConditions.push({ zailtasun_maila: { in: zailtasunak } });
    }

    if (programazio_lengoaia_ids.length > 0) {
        if (programazio_lengoaia_ids_mode === "OR") {
            andConditions.push({
                ariketa_zehatzak: {
                    some: {
                        programazio_lengoaia_id: {
                            in: programazio_lengoaia_ids,
                        },
                    },
                },
            });
        } else {
            andConditions.push({
                AND: programazio_lengoaia_ids.map((id) => ({
                    ariketa_zehatzak: {
                        some: {
                            programazio_lengoaia_id: id,
                        },
                    },
                })),
            });
        }
    }

    if (etiketa_ids.length > 0) {
        if (etiketa_ids_mode === "OR") {
            andConditions.push({
                etiketak: {
                    some: {
                        etiketa_id: { in: etiketa_ids },
                    },
                },
            });
        } else {
            andConditions.push({
                AND: etiketa_ids.map((id) => ({
                    etiketak: {
                        some: {
                            etiketa_id: id,
                        },
                    },
                })),
            });
        }
    }

    if (etiketa_kategoria_ids.length > 0) {
        if (etiketa_kategoria_ids_mode === "OR") {
            andConditions.push({
                etiketak: {
                    some: {
                        etiketa: {
                            kategoria_id: { in: etiketa_kategoria_ids },
                        },
                    },
                },
            });
        } else {
            andConditions.push({
                AND: etiketa_kategoria_ids.map((id) => ({
                    etiketak: {
                        some: {
                            etiketa: {
                                kategoria_id: id,
                            },
                        },
                    },
                })),
            });
        }
    }

    const exercises = await db.ariketa.findMany({
        orderBy: { ariketa_id: "asc" },
        select: {
            ariketa_id: true,
            ariketa_zehatzak: {
                select: {
                    ebazpenak: {
                        select: { egoera: true },
                        where: { erabiltzailea_id },
                    },
                },
            },
            izenburua: true,
            zailtasun_maila: true,
        },
        where: andConditions.length > 0 ? { AND: andConditions } : undefined,
    });

    return exercises.map((exercise) => {
        const hasStatus = (status: Egoera) =>
            exercise.ariketa_zehatzak.some((ariketa_zehatza) =>
                ariketa_zehatza.ebazpenak.some(
                    (ebazpena) => ebazpena.egoera === status,
                ),
            );
        const exerciseStatus: Egoera = hasStatus(Egoera.Gaindituta)
            ? Egoera.Gaindituta
            : hasStatus(Egoera.Hasita)
              ? Egoera.Hasita
              : Egoera.Hutsik;
        return {
            ariketa_id: exercise.ariketa_id,
            egoera: exerciseStatus,
            izenburua: exercise.izenburua,
            zailtasun_maila: exercise.zailtasun_maila,
        };
    });
}

async function getProgrammingLanguages(): Promise<
    GetProgrammingLanguagesResponse[]
> {
    return await db.programazioLengoaia.findMany({
        orderBy: [{ bertsioa: "asc" }, { izena: "asc" }],
        select: {
            bertsioa: true,
            izena: true,
            programazio_lengoaia_id: true,
        },
    });
}

async function getSpecificExercise(
    ariketa_id: number,
    erabiltzailea_id: number,
    programazio_lengoaia_id: number,
): Promise<GetSpecificExerciseResponse | null> {
    const specificExercise = await db.ariketaZehatza.findUnique({
        select: {
            ebazpenak: {
                select: {
                    ebazpena_id: true,
                    egoera: true,
                    kodea: true,
                },
                where: {
                    erabiltzailea_id,
                },
            },
            hasierako_kodea: true,
        },
        where: {
            ariketa_id_programazio_lengoaia_id: {
                ariketa_id,
                programazio_lengoaia_id,
            },
        },
    });

    if (!specificExercise) {
        return null;
    }

    return {
        ebazpena: specificExercise.ebazpenak?.[0] ?? null,
        hasierako_kodea: specificExercise.hasierako_kodea,
    };
}

async function getTags(): Promise<GetTagResponse[]> {
    return await db.etiketa.findMany({
        orderBy: { izena: "asc" },
        select: {
            deskribapena: true,
            etiketa_id: true,
            izena: true,
            kategoria_id: true,
        },
    });
}

function returnFilterByExerciseStatus(
    status: Egoera,
    erabiltzailea_id: number,
): Prisma.AriketaWhereInput {
    switch (status) {
        case Egoera.Gaindituta:
            return {
                ariketa_zehatzak: {
                    some: {
                        ebazpenak: {
                            some: {
                                egoera: Egoera.Gaindituta,
                                erabiltzailea_id,
                            },
                        },
                    },
                },
            };
        case Egoera.Hasita:
            return {
                AND: [
                    {
                        ariketa_zehatzak: {
                            some: {
                                ebazpenak: {
                                    some: {
                                        egoera: Egoera.Hasita,
                                        erabiltzailea_id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        ariketa_zehatzak: {
                            none: {
                                ebazpenak: {
                                    some: {
                                        egoera: Egoera.Gaindituta,
                                        erabiltzailea_id,
                                    },
                                },
                            },
                        },
                    },
                ],
            };
        default:
            return {
                ariketa_zehatzak: {
                    none: {
                        ebazpenak: {
                            some: {
                                egoera: {
                                    in: [Egoera.Hasita, Egoera.Gaindituta],
                                },
                                erabiltzailea_id,
                            },
                        },
                    },
                },
            };
    }
}

export default {
    getCategories,
    getExercise,
    getExercises,
    getProgrammingLanguages,
    getSpecificExercise,
    getTags,
} as const;
