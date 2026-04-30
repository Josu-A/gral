import { useCallback, useState } from "react";

import type { Egoera, Zailtasuna } from "@/common/types/entities";

interface ExercisesFilterApi {
    difficulties: Zailtasuna[];
    programmingLanguageIds: number[];
    programmingLanguageMode: FilterMode;
    setDifficulties: (difficulties: Zailtasuna[]) => void;
    setProgrammingLanguageIds: (ids: number[]) => void;
    setProgrammingLanguageMode: (mode: FilterMode) => void;
    setStatuses: (statuses: Egoera[]) => void;
    setTagCategoryIds: (ids: number[]) => void;
    setTagCategoryMode: (mode: FilterMode) => void;
    setTagIds: (tagIds: number[]) => void;
    setTagMode: (mode: FilterMode) => void;
    setTitle: (title: string) => void;
    statuses: Egoera[];
    tagCategoryIds: number[];
    tagCategoryMode: FilterMode;
    tagIds: number[];
    tagMode: FilterMode;
    title: string;
    toggleDifficulty: (value: Zailtasuna) => void;
    toggleProgrammingLanguageId: (id: number) => void;
    toggleStatus: (value: Egoera) => void;
    toggleTagCategoryId: (id: number) => void;
    toggleTagId: (id: number) => void;
}

type FilterMode = "AND" | "OR";

function toggleArrayItem<T>(array: T[], item: T): T[] {
    return array.includes(item)
        ? array.filter((i) => i !== item)
        : [...array, item];
}

function useExercisesFilter(): ExercisesFilterApi {
    const [difficulties, setDifficulties] = useState<Zailtasuna[]>([]);
    const [programmingLanguageIds, setProgrammingLanguageIds] = useState<
        number[]
    >([]);
    const [programmingLanguageMode, setProgrammingLanguageMode] =
        useState<FilterMode>("OR");
    const [statuses, setStatuses] = useState<Egoera[]>([]);
    const [tagCategoryIds, setTagCategoryIds] = useState<number[]>([]);
    const [tagCategoryMode, setTagCategoryMode] = useState<FilterMode>("OR");
    const [tagIds, setTagIds] = useState<number[]>([]);
    const [tagMode, setTagMode] = useState<FilterMode>("OR");
    const [title, setTitle] = useState<string>("");

    const toggleDifficulty = useCallback((value: Zailtasuna) => {
        setDifficulties((prev) => toggleArrayItem(prev, value));
    }, []);
    const toggleProgrammingLanguageId = useCallback((id: number) => {
        setProgrammingLanguageIds((prev) => toggleArrayItem(prev, id));
    }, []);
    const toggleStatus = useCallback((value: Egoera) => {
        setStatuses((prev) => toggleArrayItem(prev, value));
    }, []);
    const toggleTagCategoryId = useCallback((id: number) => {
        setTagCategoryIds((prev) => toggleArrayItem(prev, id));
    }, []);
    const toggleTagId = useCallback((id: number) => {
        setTagIds((prev) => toggleArrayItem(prev, id));
    }, []);

    return {
        difficulties,
        programmingLanguageIds,
        programmingLanguageMode,
        setDifficulties,
        setProgrammingLanguageIds,
        setProgrammingLanguageMode,
        setStatuses,
        setTagCategoryIds,
        setTagCategoryMode,
        setTagIds,
        setTagMode,
        setTitle,
        statuses,
        tagCategoryIds,
        tagCategoryMode,
        tagIds,
        tagMode,
        title,
        toggleDifficulty,
        toggleProgrammingLanguageId,
        toggleStatus,
        toggleTagCategoryId,
        toggleTagId,
    };
}

export { useExercisesFilter };
export type { ExercisesFilterApi, FilterMode };
