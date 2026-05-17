import { IkasketaMaila } from "@gral/datu-basea";

interface DashboardData {
    averageGrade: number;
    educationLevel: IkasketaMaila;
    lastAttempts: LastAttempts;
    solvedSolutions: SolvedSolutions;
    totalSolvedSolutions: number;
}

type LastAttempts = Array<{
    ariketa_id: number;
    denbora_zigilua: Date;
    nota: number;
    programazio_lengoaia_izena: string;
    saiakera_id: number;
}>;

type SolvedSolutions = Record<Lowercase<IkasketaMaila>, number>;

export type { DashboardData, LastAttempts, SolvedSolutions };
