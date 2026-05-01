import clsx from "clsx";
import {
    type CSSProperties,
    type JSX,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import type { FilterMode } from "@/hooks/useExercisesFilter";

import { ArrowDownIcon } from "@/components/icon/ArrowDown";

interface ExercisesSelectFilterProps<T extends number | string> {
    label: string;
    mode?: FilterMode;
    onChangeMode?: (next: FilterMode) => void;
    onToggle: (value: T) => void;
    options: ExercisesSelectOption<T>[];
    selected: T[];
}

interface ExercisesSelectOption<T extends number | string> {
    label: string;
    value: T;
}

function ExercisesSelectFilter<T extends number | string>({
    label,
    mode,
    onChangeMode,
    onToggle,
    options,
    selected,
}: ExercisesSelectFilterProps<T>): JSX.Element {
    const uniqueId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});
    const shouldHaveModeToggle = !!mode && !!onChangeMode;

    const updateDropdownPosition = (): void => {
        if (
            !containerRef.current ||
            !dropdownRef.current ||
            window.innerWidth < 640
        ) {
            setDropdownStyle({});
            return;
        }
        const triggerRect = containerRef.current.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();

        const rootStyles = getComputedStyle(document.documentElement);
        const spacing = parseFloat(rootStyles.getPropertyValue("--spacing"));
        const rootFontSize = parseFloat(rootStyles.fontSize);
        const margin = 22 * spacing * rootFontSize;

        const left = Math.max(triggerRect.right - dropdownRect.width, margin);
        setDropdownStyle({ left: `${left - triggerRect.left}px` });
    };

    useLayoutEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const handleMouseDown = (event: MouseEvent): void => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        let rafId: null | number = null;
        const handleResize = (): void => {
            if (rafId !== null) {
                return;
            }
            rafId = requestAnimationFrame(() => {
                updateDropdownPosition();
                rafId = null;
            });
        };
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleResize);
        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [isOpen]);

    const selectedCount = selected.length;
    const triggerLabel =
        selectedCount > 0 ? `${label} (${selectedCount})` : label;

    return (
        <div className="relative" ref={containerRef}>
            <button
                className={triggerClasses(selectedCount > 0)}
                onClick={() => setIsOpen((prev: boolean) => !prev)}
                type="button"
            >
                <span className="truncate">{triggerLabel}</span>
                <ArrowDownIcon
                    className={clsx(
                        "ml-2 h-4 w-4 shrink-0 transition-transform",
                        isOpen && "rotate-180",
                    )}
                />
            </button>
            {isOpen && (
                <div
                    className="fixed left-1/2 z-50 mt-1 flex max-h-50 w-[calc(100svw---spacing(30))] -translate-x-1/2 flex-col overflow-auto rounded-md border border-slate-300 bg-slate-50 p-2 shadow-md sm:absolute sm:w-xs sm:translate-x-0"
                    id={uniqueId}
                    ref={dropdownRef}
                    style={dropdownStyle}
                >
                    {shouldHaveModeToggle && (
                        <div className="mb-2 flex items-center justify-evenly border-b border-slate-200 pb-1">
                            <span className="text-xs font-medium text-gray-600">
                                Modua
                            </span>
                            <div className="inline-flex rounded-md border border-slate-300 bg-white text-xs">
                                <button
                                    className={modeButtonClasses(mode === "OR")}
                                    onClick={() => onChangeMode("OR")}
                                    type="button"
                                >
                                    EDO
                                </button>
                                <button
                                    className={modeButtonClasses(
                                        mode === "AND",
                                    )}
                                    onClick={() => onChangeMode("AND")}
                                    type="button"
                                >
                                    ETA
                                </button>
                            </div>
                        </div>
                    )}
                    {options.length === 0 ? (
                        <p className="text-center text-xs text-gray-500">
                            Aukerarik ez dago
                        </p>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-2 overflow-y-auto">
                            {options.map((option) => {
                                const isSelected = selected.includes(
                                    option.value,
                                );
                                return (
                                    <button
                                        className={filterOptionsClasses(
                                            isSelected,
                                        )}
                                        key={String(option.value)}
                                        onClick={() => onToggle(option.value)}
                                        type="button"
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function filterOptionsClasses(isSelected: boolean): string {
    return clsx(
        "rounded-lg border px-3 py-1 text-xs font-medium",
        "cursor-pointer transition-colors",
        "focus:ring-2 focus:ring-amber-500 focus:outline-none",
        isSelected
            ? "border-amber-600 bg-amber-600 text-gray-50 hover:bg-amber-700"
            : "border-slate-300 bg-slate-50 text-gray-700 hover:bg-slate-100",
    );
}

function modeButtonClasses(active: boolean): string {
    return clsx(
        "cursor-pointer px-2 py-1 font-medium transition-colors",
        "first:rounded-l-md last:rounded-r-md",
        "focus:ring-2 focus:ring-amber-500 focus:outline-none",
        active
            ? "bg-amber-600 text-gray-50"
            : "bg-slate-100 text-gray-800 hover:bg-slate-200",
    );
}

function triggerClasses(hasSelection: boolean): string {
    return clsx(
        "inline-flex h-9 w-full items-center justify-between rounded-md border px-3 text-sm",
        "cursor-pointer transition-colors",
        "focus:ring-2 focus:ring-amber-500 focus:outline-none",
        hasSelection
            ? "border-amber-600 bg-amber-50 text-amber-900 hover:bg-amber-100"
            : "border-slate-300 bg-slate-50 text-gray-800 hover:bg-slate-100",
    );
}

export { ExercisesSelectFilter };
export type { ExercisesSelectOption };
