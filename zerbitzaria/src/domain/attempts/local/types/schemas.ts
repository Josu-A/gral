import { z } from "zod";

const SolutionSaveSchema = z.object({
    ariketa_zehatza_id: z.number().int().positive(),
    kodea: z.string().nullable(),
});

type ISolutionSave = z.infer<typeof SolutionSaveSchema>;

const GetAttemptSchema = z.object({
    params: z.object({
        saiakera_id: z.coerce.number<number>().int().positive(),
    }),
});

interface GetAttemptResponse {
    saiakera_kodea: null | string;
}

type IGetAttempt = z.infer<typeof GetAttemptSchema>;

type IGetAttemptFlat = {
    saiakera_id: IGetAttempt["params"]["saiakera_id"];
};

const ListAttemptsSchema = z.object({
    query: z.object({
        ariketa_id: z.coerce.number<number>().int().positive().optional(),
    }),
});

type GetAttemptsResponse = Array<{
    denbora_zigilua: Date;
    nota: number;
    saiakera_id: number;
}>;

type IListAttempts = z.infer<typeof ListAttemptsSchema>;

type IListAttemptsFlat = {
    ariketa_id?: IListAttempts["query"]["ariketa_id"];
};

export { GetAttemptSchema, ListAttemptsSchema, SolutionSaveSchema };

export type {
    GetAttemptResponse,
    GetAttemptsResponse,
    IGetAttempt,
    IGetAttemptFlat,
    IListAttemptsFlat,
    ISolutionSave,
};
