import type { DashboardData } from "@domain/dashboard/local/types/schemas";

import logger from "@common/constants/logger";
import DashboardRepo from "@domain/dashboard/DashboardRepo";
import UserRepo from "@domain/users/UserRepo";
import { IkasketaMaila } from "@gral/datu-basea";

async function getDashboard(user_id: number): Promise<DashboardData> {
    const [averageGrade, lastAttempts, totalSolvedSolutions, solvedSolutions] =
        await Promise.all([
            DashboardRepo.getAverageGrade(user_id),
            DashboardRepo.getLastAttempts(user_id),
            DashboardRepo.getTotalSolvedSolutions(user_id),
            DashboardRepo.getSolvedSolutions(user_id),
        ]);
    const educationLevel = await UserRepo.getEducationLevel(user_id);

    const dashboardData: DashboardData = {
        averageGrade,
        educationLevel: educationLevel ?? IkasketaMaila.Hasiberria,
        lastAttempts,
        solvedSolutions,
        totalSolvedSolutions,
    };
    logger.info("Dashboarda eskuratu da", { user_id, ...dashboardData });
    return dashboardData;
}

export default {
    getDashboard,
} as const;
