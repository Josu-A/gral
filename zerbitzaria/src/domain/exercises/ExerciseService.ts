import type {
    GetCategoryResponse,
    GetExerciseResponse,
    GetProgrammingLanguagesResponse,
    GetSpecificExerciseResponse,
    GetTagResponse,
    IGetExerciseFlat,
    IGetSpecificExerciseFlat,
    IListExercises,
    ListedAriketa,
} from "@domain/exercises/local/types/schemas";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import logger from "@common/constants/logger";
import { RequestError } from "@common/utils/errors";
import AttemptRepo from "@domain/attempts/AttemptRepo";
import ExerciseRepo from "@domain/exercises/ExerciseRepo";
import UserRepo from "@domain/users/UserRepo";
import db from "@gral/datu-basea";
import { IkasketaMaila, Zailtasuna } from "@gral/datu-basea";

const IKASKETA_MAILA_TO_ZAILTASUNA: Record<IkasketaMaila, Zailtasuna> = {
    [IkasketaMaila.Aurreratua]: Zailtasuna.Zaila,
    [IkasketaMaila.Ertaina]: Zailtasuna.Ertaina,
    [IkasketaMaila.Hasiberria]: Zailtasuna.Erraza,
};

async function getCategories(): Promise<GetCategoryResponse[]> {
    const categories = await ExerciseRepo.getCategories();
    logger.info("Erabiltzaileak etiketa kategoriak lortu ditu");
    return categories;
}

async function getExercise(
    erabiltzailea_id: number,
    data: IGetExerciseFlat,
): Promise<GetExerciseResponse> {
    let preferedProgrammingLanguage = data.programazio_lengoaia_id ?? null;
    if (!preferedProgrammingLanguage) {
        preferedProgrammingLanguage =
            await UserRepo.getPreferredProgrammingLanguageId(erabiltzailea_id);
    }
    let exerciseData: GetExerciseResponse | null = null;
    await db.$transaction(async (tx) => {
        const specificExerciseId = await ExerciseRepo.getSpecificExerciseId(
            data.ariketa_id,
            preferedProgrammingLanguage,
            tx,
        );
        if (!specificExerciseId) {
            throw new RequestError(
                HttpStatusCode.NOT_FOUND,
                "Ariketa ez da aurkitu",
            );
        }
        await AttemptRepo.createSolutionIfNotExists(
            specificExerciseId.ariketa_zehatza_id,
            erabiltzailea_id,
            tx,
        );
        exerciseData = await ExerciseRepo.getExercise(
            data.ariketa_id,
            erabiltzailea_id,
            preferedProgrammingLanguage,
            tx,
        );
    });
    if (!exerciseData) {
        throw new RequestError(
            HttpStatusCode.NOT_FOUND,
            "Ariketa ez da aurkitu",
        );
    }
    logger.info("Erabiltzaileak ariketa lortu du", {
        ariketa_id: data.ariketa_id,
        erabiltzailea_id,
        programazio_lengoaia_id: preferedProgrammingLanguage,
    });
    return exerciseData;
}

async function getProgrammingLanguages(): Promise<
    GetProgrammingLanguagesResponse[]
> {
    const programmingLanguages = await ExerciseRepo.getProgrammingLanguages();
    logger.info("Erabiltzaileak programazio lengoaien zerrenda lortu du");
    return programmingLanguages;
}

async function getSpecificExercise(
    erabiltzailea_id: number,
    data: IGetSpecificExerciseFlat,
): Promise<GetSpecificExerciseResponse> {
    let exerciseData: GetSpecificExerciseResponse | null = null;
    await db.$transaction(async (tx) => {
        const specificExerciseId = await ExerciseRepo.getSpecificExerciseId(
            data.ariketa_id,
            data.programazio_lengoaia_id,
            tx,
        );
        if (!specificExerciseId) {
            throw new RequestError(
                HttpStatusCode.NOT_FOUND,
                "Ariketa ez da aurkitu",
            );
        }
        await AttemptRepo.createSolutionIfNotExists(
            specificExerciseId.ariketa_zehatza_id,
            erabiltzailea_id,
            tx,
        );
        exerciseData = await ExerciseRepo.getSpecificExercise(
            data.ariketa_id,
            erabiltzailea_id,
            data.programazio_lengoaia_id,
            tx,
        );
    });

    if (!exerciseData) {
        throw new RequestError(
            HttpStatusCode.NOT_FOUND,
            "Ariketa ez da aurkitu",
        );
    }
    logger.info("Erabiltzaileak ariketa zehatza lortu du", {
        ariketa_id: data.ariketa_id,
        erabiltzailea_id,
        programazio_lengoaia_id: data.programazio_lengoaia_id,
    });
    return exerciseData;
}

async function getTags(): Promise<GetTagResponse[]> {
    const tags = await ExerciseRepo.getTags();
    logger.info("Erabiltzaileak etiketak lortu ditu");
    return tags;
}

async function listExercises(
    erabiltzailea_id: number,
    filters: IListExercises,
): Promise<ListedAriketa[]> {
    let newFilters = filters;
    const viewOnlyUserLevel =
        await UserRepo.getViewOnlyMyLevel(erabiltzailea_id);
    if (viewOnlyUserLevel) {
        const educationLevel =
            await UserRepo.getEducationLevel(erabiltzailea_id);
        if (educationLevel) {
            const zailtasuna = IKASKETA_MAILA_TO_ZAILTASUNA[educationLevel];
            newFilters = {
                ...filters,
                zailtasunak: [zailtasuna],
            };
        }
    }

    const exercises = await ExerciseRepo.getExercises(
        erabiltzailea_id,
        newFilters,
    );
    logger.info("Erabiltzaileak ariketa zerrenda lortu du", {
        erabiltzailea_id,
    });
    return exercises;
}

export default {
    getCategories,
    getExercise,
    getProgrammingLanguages,
    getSpecificExercise,
    getTags,
    listExercises,
} as const;
