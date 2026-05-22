import { IkasketaMaila, Zailtasuna } from "@gral/datu-basea";
import z from "zod";

interface DashboardData {
    averageGrade: number;
    educationLevel: IkasketaMaila;
    lastAttempts: LastAttempts;
    maxGrade: number;
    solvedSolutions: SolvedSolutions;
    totalSolvedSolutions: number;
}

type LastAttempts = Array<{
    ariketa_id: number;
    denbora_zigilua: Date;
    izenburua: string;
    nota: number;
    programazio_lengoaia_izena: string;
    saiakera_id: number;
}>;

const GetDashboardSchema = z.object({
    attempts_to_fetch: z.coerce
        .number<number>()
        .int()
        .positive()
        .optional()
        .default(5),
});

type IGetDashboard = z.infer<typeof GetDashboardSchema>;

type SolvedSolutions = Record<Lowercase<Zailtasuna>, number>;

export { GetDashboardSchema };

export type { DashboardData, IGetDashboard, LastAttempts, SolvedSolutions };
