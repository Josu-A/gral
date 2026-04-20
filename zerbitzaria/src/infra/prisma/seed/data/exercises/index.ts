import { twoSum } from '@infra/prisma/seed/data/exercises/two-sum'

export const exerciseData = [
    twoSum
] as const;

export type ExerciseKey = typeof exerciseData[number]['key'];
