import clsx from "clsx";
import { type InputHTMLAttributes, type JSX, useId } from "react";

import { inputClasses } from "@/components/ui/styles";

interface SelectProps<T extends string> extends Omit<
    InputHTMLAttributes<HTMLSelectElement>,
    "onChange"
> {
    error?: string;
    label: string;
    onChange: (value: T) => void;
    options: {
        label: string;
        value: T;
    }[];
    value: "" | T;
}

function Select<T extends string>({
    className,
    error,
    id,
    label,
    onChange,
    options,
    value,
    ...props
}: SelectProps<T>): JSX.Element {
    const uniqueId = useId();
    const finalId = id || uniqueId;
    const isPlaceholderActive = value === "";
    return (
        <div className="flex flex-col">
            <label
                className="text-sm font-medium text-gray-800"
                htmlFor={finalId}
            >
                {label}
            </label>
            <select
                className={clsx(
                    inputClasses(!!error, className),
                    isPlaceholderActive && "text-gray-500",
                )}
                id={finalId}
                onChange={(e) => {
                    if (e.target.value !== "") {
                        onChange(e.target.value as T);
                    }
                }}
                value={value}
                {...props}
            >
                <option disabled hidden value="">
                    Hautatu...
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="mt-1 text-xs text-red-600">{error}</span>
            )}
        </div>
    );
}

export { Select };
