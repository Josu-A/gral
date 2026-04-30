import type {
    FullAriketa,
    GetCategoryResponse,
    GetExerciseResponse,
    GetProgrammingLanguagesResponse,
    GetSpecificExerciseResponse,
    GetTagResponse,
    IListExercises,
} from "@domain/exercises/local/types/schemas";

import db from "@infra/db";

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
        include: {
            ariketa_zehatzak: {
                include: {
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
                    programazio_lengoaia: true,
                },
            },
            etiketak: {
                include: {
                    etiketa: {
                        include: {
                            kategoria: {
                                select: {
                                    izena: true,
                                    kategoria_id: true,
                                },
                            },
                        },
                    },
                },
            },
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

    return {
        ariketa: exercise,
        ariketa_zehatza: chosenSpecificExercise,
        ikasle_kodea,
    };
}

async function getExercises(
    erabiltzailea_id: number,
    filters: IListExercises,
): Promise<FullAriketa[]> {
    const {
        egoera,
        etiketa_id,
        etiketa_kategoria_id,
        programazio_lengoaia_id,
        titulua,
        zailtasuna,
    } = filters;
    return await db.ariketa.findMany({
        include: {
            ariketa_zehatzak: {
                include: {
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
                    programazio_lengoaia: true,
                },
            },
            etiketak: {
                include: {
                    etiketa: {
                        include: {
                            kategoria: {
                                select: {
                                    izena: true,
                                    kategoria_id: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        where: {
            AND: [
                programazio_lengoaia_id
                    ? {
                          ariketa_zehatzak: {
                              some: { programazio_lengoaia_id },
                          },
                      }
                    : {},
                egoera
                    ? {
                          ariketa_zehatzak: {
                              some: {
                                  ebazpenak: {
                                      some: {
                                          egoera,
                                          erabiltzailea_id,
                                      },
                                  },
                              },
                          },
                      }
                    : {},
            ],
            etiketak:
                etiketa_id || etiketa_kategoria_id
                    ? {
                          some: {
                              etiketa: {
                                  etiketa_id: etiketa_id,
                                  kategoria_id: etiketa_kategoria_id,
                              },
                          },
                      }
                    : undefined,
            izenburua: titulua
                ? { contains: titulua, mode: "insensitive" }
                : undefined,
            zailtasun_maila: zailtasuna,
        },
    });
}

async function getProgrammingLanguages(): Promise<
    GetProgrammingLanguagesResponse[]
> {
    return await db.programazioLengoaia.findMany({
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

export default {
    getCategories,
    getExercise,
    getExercises,
    getProgrammingLanguages,
    getSpecificExercise,
    getTags,
} as const;
