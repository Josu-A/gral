import logger from "../logger";
import seedCategories from "./constructors/categories";
import seedExercises from "./constructors/exercises";
import seedLabels from "./constructors/labels";
import seedProgrammingLanguages from "./constructors/programmingLanguages";
import seedStudents from "./constructors/students";
import { pool, prisma } from "./utils";

async function main(): Promise<void> {
    logger.info("Taulen sorrera automatizatzen.");

    const programmingLanguages = await seedProgrammingLanguages();
    const categories = await seedCategories();
    const labels = await seedLabels(categories);
    await seedExercises(programmingLanguages, labels);
    await seedStudents(programmingLanguages);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (err) => {
        logger.error("Ezin izan da seeda sartu datu-basean:", err);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
