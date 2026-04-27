import clsx from "clsx";

const inputClasses = (hasError: boolean, className?: string): string =>
    clsx(
        "mt-1 block w-full px-3 py-2",
        "rounded-md border shadow-sm",
        "text-sm",
        "transition-colors",
        "focus:ring-2 focus:outline-none",
        hasError
            ? `border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200`
            : `border-gray-300 bg-white focus:border-amber-500 focus:ring-amber-500`,
        "disabled:bg-gray-50 disabled:text-gray-500",
        className,
    );

export { inputClasses };
