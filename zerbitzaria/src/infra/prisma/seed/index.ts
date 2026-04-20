import logger from "@common/constants/logger";
import seedCategories from "@infra/prisma/seed/constructors/categories"
import seedExercises from "@infra/prisma/seed/constructors/exercises"
import seedLabels from "@infra/prisma/seed/constructors/labels"
import seedProgrammingLanguages from "@infra/prisma/seed/constructors/programmingLanguages"
import seedStudents from "@infra/prisma/seed/constructors/students"
import { pool, prisma } from "@infra/prisma/seed/utils";

async function main(): Promise<void> {
    logger.info("Taulen sorrera automatizatzen.");

    const programmingLanguages = await seedProgrammingLanguages();
    const categories = await seedCategories();
    const labels = await seedLabels(categories);
    await seedExercises(programmingLanguages, labels);
    await seedStudents(programmingLanguages);
}

main().then(async () => {
    await prisma.$disconnect();
    await pool.end();
}).catch(async (err) => {
    logger.error("Ezin izan da seeda sartu datu-basean:", err)
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
});
