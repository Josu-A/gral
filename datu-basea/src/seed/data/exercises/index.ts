import { medianOfTwoSortedArrays } from "./median-of-two-sorted-arrays";
import { palindromeNumber } from "./palindrome-number";
import { twoSum } from "./two-sum";

export const exerciseData = [
    twoSum,
    medianOfTwoSortedArrays,
    palindromeNumber,
] as const;

export type ExerciseKey = (typeof exerciseData)[number]["key"];
