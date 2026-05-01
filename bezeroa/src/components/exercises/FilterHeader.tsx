import type { JSX } from "react";

import type { ExercisesFilterApi } from "@/hooks/useExercisesFilter";

import {
    type Egoera,
    EGOERAK,
    type Zailtasuna,
    ZAILTASUNAK,
} from "@/common/types/entities";
import { ExercisesSelectFilter } from "@/components/exercises/ExercisesSelectFilter";
import { Input } from "@/components/ui/Input";

interface CategoryOption {
    label: string;
    value: number;
}

interface FilterHeaderProps {
    categories: CategoryOption[];
    filter: ExercisesFilterApi;
    isLoadingOptions: boolean;
    languages: ProgrammingLanguageOption[];
    tags: TagOption[];
}

interface ProgrammingLanguageOption {
    label: string;
    value: number;
}

interface TagOption {
    label: string;
    value: number;
}

function FilterHeader({
    categories,
    filter,
    isLoadingOptions,
    languages,
    tags,
}: FilterHeaderProps): JSX.Element {
    return (
        <section className="rounded-md border border-slate-300 bg-slate-100 p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-47 flex-1">
                    <Input
                        autoComplete="off"
                        inputMode="search"
                        label="Izenburua"
                        onChange={(e) => filter.setTitle(e.target.value)}
                        placeholder="Bilatu izenburua erabiliz..."
                        type="search"
                        value={filter.title}
                    />
                </div>
                <ExercisesSelectFilter<Egoera>
                    label="Egoera"
                    onToggle={filter.toggleStatus}
                    options={EGOERAK}
                    selected={filter.statuses}
                />
                <ExercisesSelectFilter<Zailtasuna>
                    label="Zailtasuna"
                    onToggle={filter.toggleDifficulty}
                    options={ZAILTASUNAK}
                    selected={filter.difficulties}
                />
                <ExercisesSelectFilter<number>
                    label={isLoadingOptions ? "Lengoaiak..." : "Lengoaiak"}
                    mode={filter.programmingLanguageMode}
                    onChangeMode={filter.setProgrammingLanguageMode}
                    onToggle={filter.toggleProgrammingLanguageId}
                    options={languages}
                    selected={filter.programmingLanguageIds}
                />
                <ExercisesSelectFilter<number>
                    label={isLoadingOptions ? "Etiketak..." : "Etiketak"}
                    mode={filter.tagMode}
                    onChangeMode={filter.setTagMode}
                    onToggle={filter.toggleTagId}
                    options={tags}
                    selected={filter.tagIds}
                />
                <ExercisesSelectFilter<number>
                    label={isLoadingOptions ? "Kategoriak..." : "Kategoriak"}
                    mode={filter.tagCategoryMode}
                    onChangeMode={filter.setTagCategoryMode}
                    onToggle={filter.toggleTagCategoryId}
                    options={categories}
                    selected={filter.tagCategoryIds}
                />
            </div>
        </section>
    );
}

export type { CategoryOption, ProgrammingLanguageOption, TagOption };
export { FilterHeader };
