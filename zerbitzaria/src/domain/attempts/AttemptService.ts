import type {
    GetAttemptResponse,
    GetAttemptsResponse,
    IAttemptSubmit,
    IGetAttemptFlat,
    IListAttemptsFlat,
    ISolutionSave,
    SubmitAttemptResponse,
} from "@domain/attempts/local/types/schemas";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import logger from "@common/constants/logger";
import { RequestError } from "@common/utils/errors";
import AttemptRepo from "@domain/attempts/AttemptRepo";
import db from "@infra/db";
import mcp from "@infra/mcp";

async function getAttempt(
    erabiltzailea_id: number,
    data: IGetAttemptFlat,
): Promise<GetAttemptResponse> {
    const attempt = await AttemptRepo.getAttempt(erabiltzailea_id, data);
    if (!attempt) {
        throw new RequestError(
            HttpStatusCode.NOT_FOUND,
            "Saiakera ez da aurkitu",
        );
    }
    logger.info("Erabiltzaileak saiakera lortu du", {
        erabiltzailea_id,
        saiakera_id: data.saiakera_id,
    });
    return attempt;
}

async function listAttempts(
    erabiltzailea_id: number,
    data: IListAttemptsFlat,
): Promise<GetAttemptsResponse> {
    const attempts = await AttemptRepo.listAttempts(erabiltzailea_id, data);
    logger.info("Erabiltzaileak saiakerak lortu ditu", {
        ariketa_id: data.ariketa_id,
        erabiltzailea_id,
        saiakera_kopurua: attempts.length,
    });
    return attempts;
}

async function saveSolution(
    erabiltzailea_id: number,
    data: ISolutionSave,
): Promise<void> {
    const solution = await AttemptRepo.saveSolution(erabiltzailea_id, data);
    if (!solution) {
        throw new RequestError(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Errorea ebazpena gordetzean",
        );
    }
    logger.info("Ebazpena gorde da", { erabiltzailea_id, ...data });
}

async function submitAttempt(
    erabiltzailea_id: number,
    data: IAttemptSubmit,
): Promise<SubmitAttemptResponse> {
    const context = await AttemptRepo.getSubmissionContext(
        data.ariketa_zehatza_id,
    );
    if (!context) {
        throw new RequestError(
            HttpStatusCode.NOT_FOUND,
            "Ariketa zehatza ez da aurkitu",
        );
    }
    if (context.testak.length === 0) {
        throw new RequestError(
            HttpStatusCode.UNPROCESSABLE_ENTITY,
            "Ariketa zehatzak ez ditu testik",
        );
    }

    const result = await mcp.executeCode(context.programazio_lengoaia.izena, {
        attempt: {
            header: context.buru_fitxategia,
            source: data.kodea,
        },
        tests: context.testak,
    });

    const testResults = result.output?.testResults ?? [];
    const totalWeight = testResults.reduce((sum, test) => sum + test.weight, 0);
    const passedWeight = testResults.reduce(
        (sum, test) => sum + (test.status === "passed" ? test.weight : 0),
        0,
    );
    const score = totalWeight > 0 ? (passedWeight / totalWeight) * 10 : 0;

    await db.$transaction(async (tx) => {
        const solution = await AttemptRepo.saveSolution(
            erabiltzailea_id,
            data,
            tx,
        );
        const attempt = await AttemptRepo.addAttempt(
            {
                ebazpena_id: solution.ebazpena_id,
                nota: score,
                saiakera_kodea: data.kodea,
            },
            tx,
        );
        if (testResults.length > 0) {
            await AttemptRepo.addExecutions(
                attempt.saiakera_id,
                testResults,
                tx,
            );
        }
        if (score >= 5) {
            await AttemptRepo.markSolutionAsCompleted(solution.ebazpena_id, tx);
        }
    });

    logger.info("Ebazpena bidali da MCP code execution zerbitzarira", {
        ariketa_zehatza_id: data.ariketa_zehatza_id,
        erabiltzailea_id,
        language: context.programazio_lengoaia.izena,
    });

    return {
        isError: result.isError,
        output: result.output,
    };
}

export default {
    getAttempt,
    listAttempts,
    saveSolution,
    submitAttempt,
} as const;
