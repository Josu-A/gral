import Paths from "@common/constants/Paths";
import ExerciseController from "@domain/exercises/ExerciseController";
import { authenticate } from "@routers/middleware/authentication";
import { Router } from "express";

const exerciseRouter = Router();

exerciseRouter.use(authenticate);

exerciseRouter.get(Paths.Exercises.List, ExerciseController.listExercises);
exerciseRouter.get(
    Paths.Exercises.ProgrammingLanguages,
    ExerciseController.getProgrammingLanguages,
);
exerciseRouter.get(Paths.Exercises.Tags, ExerciseController.getTags);
exerciseRouter.get(
    Paths.Exercises.Categories,
    ExerciseController.getCategories,
);
exerciseRouter.get(Paths.Exercises.View, ExerciseController.getExercise);
exerciseRouter.get(
    Paths.Exercises.Language,
    ExerciseController.getSpecificExercise,
);

export default exerciseRouter;
