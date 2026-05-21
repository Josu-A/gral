import { Prisma } from "@gral/datu-basea";
import { Egoera, Zailtasuna } from "@gral/datu-basea";
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

const FilterMode = z.enum(["AND", "OR"]).default("OR");

const queryToArray = z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
        if (!val) {
            return [];
        }
        const raw = Array.isArray(val) ? val : [val];
        return raw
            .flatMap((s) => s.split(","))
            .map((s) => s.trim())
            .filter(Boolean);
    });

const intArrayFromQuery = queryToArray
    .transform((items) => items.map(Number))
    .pipe(
        z
            .array(z.number().int().positive())
            .transform((vals) => Array.from(new Set(vals))),
    );

const enumArrayFromQuery = <T extends z.ZodTypeAny>(enumSchema: T) =>
    queryToArray.pipe(z.array(z.string())).transform((vals) => {
        const result: z.infer<T>[] = [];
        for (const val of vals) {
            const parsed = enumSchema.safeParse(val);
            if (parsed.success) {
                result.push(parsed.data);
            }
        }
        return Array.from(new Set(result));
    });

const ListExercisesSchema = z.object({
    egoerak: enumArrayFromQuery(z.enum(Egoera)),
    etiketa_ids: intArrayFromQuery,
    etiketa_ids_mode: FilterMode,
    etiketa_kategoria_ids: intArrayFromQuery,
    etiketa_kategoria_ids_mode: FilterMode,
    programazio_lengoaia_ids: intArrayFromQuery,
    programazio_lengoaia_ids_mode: FilterMode,
    titulua: z
        .string()
        .trim()
        .nullish()
        .transform((s) => s || undefined),
    zailtasunak: enumArrayFromQuery(z.enum(Zailtasuna)),
});

type ExerciseArgs = {
    select: {
        ariketa_zehatzak: {
            select: {
                ariketa_zehatza_id: true;
                ebazpenak: {
                    select: {
                        ebazpena_id: true;
                    };
                };
                hasierako_kodea: true;
                programazio_lengoaia: {
                    select: {
                        bertsioa: true;
                        izena: true;
                        programazio_lengoaia_id: true;
                    };
                };
                programazio_lengoaia_id: true;
            };
        };
        enuntziatua: true;
        etiketak: {
            select: {
                etiketa: {
                    select: {
                        izena: true;
                    };
                };
            };
        };
        izenburua: true;
        zailtasun_maila: true;
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

interface GetSpecificExerciseIdResponse {
    ariketa_zehatza_id: number;
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

interface ListedAriketa {
    ariketa_id: number;
    egoera: Egoera;
    izenburua: string;
    zailtasun_maila: Zailtasuna;
}

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
    GetSpecificExerciseIdResponse,
    GetSpecificExerciseResponse,
    GetTagResponse,
    IGetExercise,
    IGetExerciseFlat,
    IGetSpecificExercise,
    IGetSpecificExerciseFlat,
    IListExercises,
    ListedAriketa,
};
