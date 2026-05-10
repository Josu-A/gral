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
    const isSaved = await AttemptRepo.saveSolution(erabiltzailea_id, data);
    if (!isSaved) {
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
