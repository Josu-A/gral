import type {
    DashboardData
} from '@domain/dashboard/local/types/schemas';

import DashboardRepo from '@domain/dashboard/DashboardRepo';
import UserRepo from '@domain/users/UserRepo';
import { IkasketaMaila } from "@infra/prisma/generated/enums";

async function getDashboard(user_id: number): Promise<DashboardData> {
    const [
        averageGrade,
        lastAttempts,
        totalSolvedSolutions,
        solvedSolutions
    ] = await Promise.all([
        DashboardRepo.getAverageGrade(user_id),
        DashboardRepo.getLastAttempts(user_id),
        DashboardRepo.getTotalSolvedSolutions(user_id),
        DashboardRepo.getSolvedSolutions(user_id)
    ]);
    const educationLevel = await UserRepo.getEducationLevel(user_id);

    return {
        averageGrade,
        educationLevel: educationLevel ?? IkasketaMaila.Hasiberria,
        lastAttempts,
        solvedSolutions,
        totalSolvedSolutions
    };
}

export default {
    getDashboard
} as const;