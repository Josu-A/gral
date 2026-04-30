import { Prisma } from "@infra/prisma/generated/client";
import { Egoera, Zailtasuna } from "@infra/prisma/generated/enums";
import { z } from "zod";

const GetExerciseSchema = z.object({
    params: z.object({
        ariketa_id: z.coerce.number<number>().int().positive(),
    }),
    query: z.object({
        programazio_lengoaia_id: z.coerce
            .number<number>()
            .int()
            .positive()
            .optional(),
    }),
});

type IGetExercise = z.infer<typeof GetExerciseSchema>;
type IGetExerciseFlat = {
    ariketa_id: IGetExercise["params"]["ariketa_id"];
    programazio_lengoaia_id?: IGetExercise["query"]["programazio_lengoaia_id"];
};

const GetSpecificExerciseSchema = z.object({
    params: z.object({
        ariketa_id: z.coerce.number<number>().int().positive(),
    }),
    query: z.object({
        programazio_lengoaia_id: z.coerce.number<number>().int().positive(),
    }),
});

type IGetSpecificExercise = z.infer<typeof GetSpecificExerciseSchema>;
type IGetSpecificExerciseFlat = {
    ariketa_id: IGetSpecificExercise["params"]["ariketa_id"];
    programazio_lengoaia_id: IGetSpecificExercise["query"]["programazio_lengoaia_id"];
};

const ListExercisesSchema = z.object({
    egoera: z.enum(Egoera).optional(),
    etiketa_id: z.coerce.number<number>().int().positive().optional(),
    etiketa_kategoria_id: z.coerce.number<number>().int().positive().optional(),
    programazio_lengoaia_id: z.coerce
        .number<number>()
        .int()
        .positive()
        .optional(),
    titulua: z.string().trim().optional(),
    zailtasuna: z.enum(Zailtasuna).optional(),
});

type ExerciseArgs = {
    include: {
        ariketa_zehatzak: {
            include: {
                ebazpenak: true;
                programazio_lengoaia: true;
            };
        };
        etiketak: {
            include: {
                etiketa: {
                    include: {
                        kategoria: {
                            select: { izena: true; kategoria_id: true };
                        };
                    };
                };
            };
        };
    };
};

type FullAriketa = Prisma.AriketaGetPayload<ExerciseArgs>;
type FullAriketaZehatza = FullAriketa["ariketa_zehatzak"][number];

interface GetCategoryResponse {
    deskribapena: string;
    izena: string;
    kategoria_id: number;
}

interface GetExerciseResponse {
    ariketa: FullAriketa;
    ariketa_zehatza: FullAriketaZehatza | null;
    ikasle_kodea: null | string;
}

interface GetProgrammingLanguagesResponse {
    bertsioa: string;
    izena: string;
    programazio_lengoaia_id: number;
}

interface GetSpecificExerciseResponse {
    ebazpena: null | SinglePartialEbazpena;
    hasierako_kodea: string;
}

interface GetTagResponse {
    deskribapena: string;
    etiketa_id: number;
    izena: string;
    kategoria_id: number;
}

type IListExercises = z.infer<typeof ListExercisesSchema>;

type PartialEbazpenaPayload = Prisma.AriketaZehatzaGetPayload<SolutionArgs>;
type SinglePartialEbazpena = PartialEbazpenaPayload["ebazpenak"][number];

type SolutionArgs = {
    select: {
        ebazpenak: {
            select: {
                ebazpena_id: true;
                egoera: true;
                kodea: true;
            };
        };
        hasierako_kodea: true;
    };
};

export { GetExerciseSchema, GetSpecificExerciseSchema, ListExercisesSchema };

export type {
    FullAriketa,
    GetCategoryResponse,
    GetExerciseResponse,
    GetProgrammingLanguagesResponse,
    GetSpecificExerciseResponse,
    GetTagResponse,
    IGetExercise,
    IGetExerciseFlat,
    IGetSpecificExercise,
    IGetSpecificExerciseFlat,
    IListExercises,
};
