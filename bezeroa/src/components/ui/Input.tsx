import { type InputHTMLAttributes, type JSX, useId } from "react";

import { inputClasses } from "@/components/ui/styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label: string;
}

function Input({
    className,
    error,
    id,
    label,
    ...props
}: InputProps): JSX.Element {
    const uniqueId = useId();
    const finalId = id || uniqueId;
    return (
        <div className="flex flex-col">
            <label
                className="text-sm font-medium text-gray-800"
                htmlFor={finalId}
            >
                {label}
            </label>
            <input
                className={inputClasses(!!error, className)}
                id={finalId}
                {...props}
            />
            {error && (
                <span className="mt-1 text-xs text-red-600">{error}</span>
            )}
        </div>
    );
}

export { Input };
