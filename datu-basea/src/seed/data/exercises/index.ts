import { courseSchedule } from "./course-schedule";
import { medianOfTwoSortedArrays } from "./median-of-two-sorted-arrays";
import { numberOfAtoms } from "./number-of-atoms";
import { palindromeNumber } from "./palindrome-number";
import { reverseInteger } from "./reverse-integer";
import { twoSum } from "./two-sum";

export const exerciseData = [
    twoSum,
    medianOfTwoSortedArrays,
    palindromeNumber,
    numberOfAtoms,
    reverseInteger,
    courseSchedule,
] as const;

export type ExerciseKey = (typeof exerciseData)[number]["key"];
