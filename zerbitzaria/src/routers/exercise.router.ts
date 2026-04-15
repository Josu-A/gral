import Paths from '@common/constants/Paths';
import ExerciseController from '@domain/exercises/ExerciseController';
import { Router } from 'express';

const exerciseRouter = Router();

exerciseRouter.get(Paths.Exercises.List, ExerciseController.listExercises);
exerciseRouter.get(Paths.Exercises.View, ExerciseController.getExercise);
exerciseRouter.get(Paths.Exercises.Language, ExerciseController.getSpecificExercise);

export default exerciseRouter;
