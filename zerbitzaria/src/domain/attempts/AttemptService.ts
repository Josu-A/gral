import type {
    GetAttemptResponse,
    GetAttemptsResponse,
    IGetAttemptFlat,
    IListAttemptsFlat,
    ISolutionSave,
} from "@domain/attempts/local/types/schemas";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import logger from "@common/constants/logger";
import { RequestError } from "@common/utils/errors";
import AttemptRepo from "@domain/attempts/AttemptRepo";

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

export default {
    getAttempt,
    listAttempts,
    saveSolution,
} as const;
