import type {
    GetAttemptResponse,
    GetAttemptsResponse,
    GetSpecificAttemptsResponse,
    IAddAttempt,
    IAddAttemptResponse,
    IGetAttemptFlat,
    IListAttemptsFlat,
    ISolutionSave,
    RunAttemptTestResult,
    SolutionId,
    SubmissionContext,
} from "@domain/attempts/local/types/schemas";
import type { Prisma, PrismaClient } from "@gral/datu-basea";

import db from "@gral/datu-basea";
import { Egoera } from "@gral/datu-basea";

type DbClient = Prisma.TransactionClient | PrismaClient;

async function addAttempt(
    data: IAddAttempt,
    databaseClient: DbClient = db,
): Promise<IAddAttemptResponse> {
    const attempt = await databaseClient.saiakera.create({
        data: {
            ebazpena_id: data.ebazpena_id,
            nota: data.nota,
            saiakera_kodea: data.saiakera_kodea,
        },
        select: {
            denbora_zigilua: true,
            nota: true,
            saiakera_id: true,
        },
    });
    return attempt;
}

async function addExecutions(
    saiakera_id: number,
    testResults: Array<RunAttemptTestResult>,
    databaseClient: DbClient = db,
): Promise<void> {
    await databaseClient.exekuzioa.createMany({
        data: testResults.map((testResult) => ({
            emaitza: JSON.stringify({
                exitCode: testResult.exitCode,
                phase: testResult.phase,
                status: testResult.status,
                stderr: testResult.stderr,
                stdout: testResult.stdout,
            }),
            exekuzio_denbora: testResult.duration,
            saiakera_id: saiakera_id,
            testa_id: testResult.testId,
            zuzena: testResult.status === "passed",
        })),
    });
}

async function createSolutionIfNotExists(
    ariketa_zehatza_id: number,
    erabiltzailea_id: number,
    databaseClient: DbClient = db,
): Promise<void> {
    await databaseClient.ebazpena.upsert({
        create: {
            ariketa_zehatza_id,
            erabiltzailea_id,
        },
        update: {},
        where: {
            erabiltzailea_id_ariketa_zehatza_id: {
                ariketa_zehatza_id,
                erabiltzailea_id,
            },
        },
    });
}

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
                    testa_id: true,
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

async function listSpecificAttempts(
    erabiltzailea_id: number,
    ebazpena_id: number,
): Promise<GetSpecificAttemptsResponse> {
    const attempts = await db.saiakera.findMany({
        orderBy: {
            denbora_zigilua: "desc",
        },
        select: {
            denbora_zigilua: true,
            nota: true,
        },
        take: 10,
        where: {
            ebazpena: {
                erabiltzailea_id,
            },
            ebazpena_id,
        },
    });
    return attempts;
}

async function markSolutionAsCompleted(
    ebazpena_id: number,
    databaseClient: DbClient = db,
): Promise<void> {
    await databaseClient.ebazpena.update({
        data: {
            egoera: Egoera.Gaindituta,
        },
        where: {
            ebazpena_id,
        },
    });
}

async function saveSolution(
    erabiltzailea_id: number,
    data: ISolutionSave,
    databaseClient: DbClient = db,
): Promise<SolutionId> {
    const result = await databaseClient.ebazpena.upsert({
        create: {
            ariketa_zehatza_id: data.ariketa_zehatza_id,
            egoera: Egoera.Hasita,
            erabiltzailea_id,
            kodea: data.kodea,
        },
        select: {
            ebazpena_id: true,
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
    return result;
}

export default {
    addAttempt,
    addExecutions,
    createSolutionIfNotExists,
    getAttempt,
    getSubmissionContext,
    listAttempts,
    listSpecificAttempts,
    markSolutionAsCompleted,
    saveSolution,
} as const;
