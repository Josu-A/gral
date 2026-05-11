import { z } from "zod";

const SolutionSaveSchema = z.object({
    ariketa_zehatza_id: z.number().int().positive(),
    kodea: z.string().nullable(),
});

type ISolutionSave = z.infer<typeof SolutionSaveSchema>;

const AttemptSubmitSchema = z.object({
    ariketa_zehatza_id: z.number().int().positive(),
    kodea: z.string().min(1, "Kodea ezin da hutsik egon"),
});

type IAttemptSubmit = z.infer<typeof AttemptSubmitSchema>;

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

interface RunAttemptResult {
    duration: number;
    error: null | string;
    preRun: null | {
        duration: number;
        exitCode: null | number;
        stderr: string;
        stdout: string;
        success: boolean;
    };
    testResults?: {
        duration: number;
        exitCode: null | number;
        name: string;
        ordera: number;
        phase: null | string;
        status: string;
        stderr: string;
        stdout: string;
        weight: number;
    }[];
}

interface SubmissionContext {
    buru_fitxategia: null | string;
    programazio_lengoaia: {
        izena: string;
    };
    testak: Array<SubmissionContextTest>;
}

interface SubmissionContextTest {
    fitxategi_izena: string;
    izena: string;
    ordena: number;
    pisua: number;
    testa_kodea: string;
    timeout: number;
}

interface SubmitAttemptResponse {
    isError: boolean;
    output: null | RunAttemptResult;
}

export {
    AttemptSubmitSchema,
    GetAttemptSchema,
    ListAttemptsSchema,
    SolutionSaveSchema,
};

export type {
    GetAttemptResponse,
    GetAttemptsResponse,
    IAttemptSubmit,
    IGetAttempt,
    IGetAttemptFlat,
    IListAttemptsFlat,
    ISolutionSave,
    RunAttemptResult,
    SubmissionContext,
    SubmissionContextTest,
    SubmitAttemptResponse,
};
