import { type JSX, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import apiClient from "@/common/apiClient";
import { handleApiError } from "@/common/errorHelper";
import {
    type ExerciseRow,
    ExercisesTable,
} from "@/components/exercises/ExercisesTable";
import {
    type CategoryOption,
    FilterHeader,
    type ProgrammingLanguageOption,
    type TagOption,
} from "@/components/exercises/FilterHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { useExercisesFilter } from "@/hooks/useExercisesFilter";

interface CategoriesResponse {
    data?: {
        deskribapena: string;
        izena: string;
        kategoria_id: number;
    }[];
    error?: string;
    success: boolean;
}

interface ListedAriketaResponse {
    data?: ExerciseRow[];
    error?: string;
    success: boolean;
}

interface ProgrammingLanguagesResponse {
    data?: {
        bertsioa: string;
        izena: string;
        programazio_lengoaia_id: number;
    }[];
    error?: string;
    success: boolean;
}

interface TagsResponse {
    data?: {
        deskribapena: string;
        etiketa_id: number;
        izena: string;
        kategoria_id: number;
    }[];
    error?: string;
    success: boolean;
}

const ERROR_GENERIC_FETCH = "Akats bat gertatu da ariketak eskuratzean";
const ERROR_GENERIC_OPTIONS = "Akats bat gertatu iragazkiak eskuratzean";

function Exercises(): JSX.Element {
    const filter = useExercisesFilter();
    const debouncedTitle = useDebounce(filter.title, 300);

    const [exercises, setExercises] = useState<ExerciseRow[]>([]);
    const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(true);
    const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);
    const [programmingLanguages, setProgrammingLanguages] = useState<
        ProgrammingLanguageOption[]
    >([]);
    const [tags, setTags] = useState<TagOption[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        const loadOptions = async (): Promise<void> => {
            setIsLoadingOptions(true);
            try {
                const [proglangRes, tagRes, catRes] = await Promise.all([
                    apiClient.get<ProgrammingLanguagesResponse>(
                        "/exercises/programming-languages",
                        { signal: controller.signal },
                    ),
                    apiClient.get<TagsResponse>("/exercises/tags", {
                        signal: controller.signal,
                    }),
                    apiClient.get<CategoriesResponse>("/exercises/categories", {
                        signal: controller.signal,
                    }),
                ]);

                if (!proglangRes.data.success) {
                    toast.error(
                        proglangRes.data.error || ERROR_GENERIC_OPTIONS,
                    );
                } else {
                    setProgrammingLanguages(
                        (proglangRes.data.data || []).map(
                            (programmingLanguage) => ({
                                label: `${programmingLanguage.izena} ${programmingLanguage.bertsioa}`,
                                value: programmingLanguage.programazio_lengoaia_id,
                            }),
                        ),
                    );
                }

                if (!tagRes.data.success) {
                    toast.error(tagRes.data.error || ERROR_GENERIC_OPTIONS);
                } else {
                    setTags(
                        (tagRes.data.data || []).map((tag) => ({
                            label: tag.izena,
                            value: tag.etiketa_id,
                        })),
                    );
                }

                if (!catRes.data.success) {
                    toast.error(catRes.data.error || ERROR_GENERIC_OPTIONS);
                } else {
                    setCategories(
                        (catRes.data.data || []).map((category) => ({
                            label: category.izena,
                            value: category.kategoria_id,
                        })),
                    );
                }
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                toast.error(handleApiError(err, ERROR_GENERIC_OPTIONS).general);
            } finally {
                setIsLoadingOptions(false);
            }
        };

        loadOptions();

        return () => controller.abort();
    }, []);

    const params = useMemo(() => {
        const query: Record<string, string> = {};
        const trimmedTitle = debouncedTitle.trim();
        if (trimmedTitle.length > 0) {
            query.titulua = trimmedTitle;
        }
        if (filter.statuses.length > 0) {
            query.egoerak = filter.statuses.join(",");
        }
        if (filter.difficulties.length > 0) {
            query.zailtasunak = filter.difficulties.join(",");
        }
        if (filter.programmingLanguageIds.length > 0) {
            query.programazio_lengoaia_ids =
                filter.programmingLanguageIds.join(",");
            query.programazio_lengoaia_ids_mode =
                filter.programmingLanguageMode;
        }
        if (filter.tagIds.length > 0) {
            query.etiketa_ids = filter.tagIds.join(",");
            query.etiketa_ids_mode = filter.tagMode;
        }
        if (filter.tagCategoryIds.length > 0) {
            query.kategoria_ids = filter.tagCategoryIds.join(",");
            query.kategoria_ids_mode = filter.tagCategoryMode;
        }
        return query;
    }, [
        debouncedTitle,
        filter.tagCategoryIds,
        filter.tagCategoryMode,
        filter.difficulties,
        filter.programmingLanguageIds,
        filter.programmingLanguageMode,
        filter.statuses,
        filter.tagIds,
        filter.tagMode,
    ]);

    useEffect(() => {
        const controller = new AbortController();
        const loadExercises = async (): Promise<void> => {
            setIsLoadingExercises(true);
            try {
                const res = await apiClient.get<ListedAriketaResponse>(
                    "/exercises/",
                    {
                        params,
                        signal: controller.signal,
                    },
                );

                if (!res.data.success) {
                    toast.error(res.data.error || ERROR_GENERIC_FETCH);
                    setExercises([]);
                } else {
                    setExercises(res.data.data || []);
                }
            } catch (err: unknown) {
                if (
                    err instanceof Error &&
                    (err.name === "CanceledError" || err.name === "AbortError")
                ) {
                    return;
                }
                toast.error(handleApiError(err, ERROR_GENERIC_FETCH).general);
                setExercises([]);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingExercises(false);
                }
            }
        };

        loadExercises();

        return () => controller.abort();
    }, [params]);

    return (
        <div className="mx-auto h-full max-w-7xl">
            <div className="mx-6 flex flex-col gap-6 px-6 py-8 sm:mx-12">
                <h1 className="text-2xl font-semibold">Ariketak ebatzi!</h1>
                <FilterHeader
                    categories={categories}
                    filter={filter}
                    isLoadingOptions={isLoadingOptions}
                    languages={programmingLanguages}
                    tags={tags}
                />
                <ExercisesTable
                    exercises={exercises}
                    isLoading={isLoadingExercises}
                />
            </div>
        </div>
    );
}

export default Exercises;
