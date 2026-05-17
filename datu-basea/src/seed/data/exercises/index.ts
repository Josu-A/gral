import { twoSum } from "./two-sum";

export const exerciseData = [twoSum] as const;

export type ExerciseKey = (typeof exerciseData)[number]["key"];
