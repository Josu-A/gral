import type {
    GetAttemptResponse,
    GetAttemptsResponse,
    IGetAttemptFlat,
    IListAttemptsFlat,
    ISolutionSave,
    SubmissionContext,
} from "@domain/attempts/local/types/schemas";

import db from "@infra/db";
import { Egoera } from "@infra/prisma/generated/enums";

async function getAttempt(
    erabiltzailea_id: number,
    data: IGetAttemptFlat,
): Promise<GetAttemptResponse | null> {
    const attempt = await db.saiakera.findUnique({
        select: {
            saiakera_kodea: true,
        },
        where: {
            ebazpena: {
                erabiltzailea_id,
            },
            saiakera_id: data.saiakera_id,
        },
    });
    return attempt;
}

async function getSubmissionContext(
    ariketa_zehatza_id: number,
): Promise<null | SubmissionContext> {
    const ariketaZehatza = await db.ariketaZehatza.findUnique({
        select: {
            buru_fitxategia: true,
            programazio_lengoaia: {
                select: {
                    izena: true,
                },
            },
            testak: {
                orderBy: {
                    ordena: "asc",
                },
                select: {
                    fitxategi_izena: true,
                    izena: true,
                    ordena: true,
                    pisua: true,
                    testa_kodea: true,
                    timeout: true,
                },
            },
        },
        where: { ariketa_zehatza_id },
    });
    return ariketaZehatza;
}

async function listAttempts(
    erabiltzailea_id: number,
    data: IListAttemptsFlat,
): Promise<GetAttemptsResponse> {
    const attempts = await db.saiakera.findMany({
        orderBy: {
            denbora_zigilua: "desc",
        },
        select: {
            denbora_zigilua: true,
            nota: true,
            saiakera_id: true,
        },
        where: {
            ebazpena: {
                ariketa_zehatza: {
                    ariketa_id: data.ariketa_id,
                },
                erabiltzailea_id,
            },
        },
    });
    return attempts;
}

async function saveSolution(
    erabiltzailea_id: number,
    data: ISolutionSave,
): Promise<boolean> {
    const result = await db.ebazpena.upsert({
        create: {
            ariketa_zehatza_id: data.ariketa_zehatza_id,
            egoera: Egoera.Hasita,
            erabiltzailea_id,
            kodea: data.kodea,
        },
        update: {
            egoera: Egoera.Hasita,
            kodea: data.kodea,
        },
        where: {
            erabiltzailea_id_ariketa_zehatza_id: {
                ariketa_zehatza_id: data.ariketa_zehatza_id,
                erabiltzailea_id,
            },
        },
    });
    return !!result;
}

export default {
    getAttempt,
    getSubmissionContext,
    listAttempts,
    saveSolution,
} as const;
