import clsx from 'clsx';
import { type InputHTMLAttributes, type JSX } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label: string;
}

const inputGroupClasses = "flex flex-col";

const labelClasses = "text-sm font-medium text-gray-800";

const inputClasses = (hasError: boolean, className?: string): string => clsx(
    'mt-1 block w-full px-3 py-2',
    'rounded-md border shadow-sm',
    'text-sm',
    'transition-colors',
    'focus:ring-2 focus:outline-none',
    hasError
        ? `
          border-red-500 bg-red-50
          focus:border-red-500 focus:ring-red-200
        `
        : `
          border-gray-300 bg-white
          focus:border-amber-500 focus:ring-amber-500
        `,
    'disabled:bg-gray-50 disabled:text-gray-500',
    className
);

const inputErrorLabelClasses = "mt-1 text-xs text-red-600";

function Input({className, error, id, label, ...props}: InputProps): JSX.Element {
    return (
        <div className={inputGroupClasses}>
            <label className={labelClasses} htmlFor={id}>
                {label}
            </label>
            <input
                className={inputClasses(!!error, className)}
                id={id}
                {...props}
            />
            {error && (
                <span className={inputErrorLabelClasses}>
                    {error}
                </span>
            )}
        </div>
    );
}

export {
    Input
}