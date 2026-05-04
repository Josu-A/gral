import clsx from "clsx";
import { type ButtonHTMLAttributes, type JSX } from "react";

import type { ComponentVariant } from "@/components/ui/types";

import { tw } from "@/common/types";
import { SpinnerIcon } from "@/components/icon/Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: ComponentVariant;
}

type ButtonVariantClasses = Record<
    ComponentVariant,
    {
        idle: string;
        loading: string;
    }
>;

const buttonClasses = (
    isLoading: boolean,
    variant: ComponentVariant,
    className?: string,
): string =>
    clsx(
        "flex justify-center px-4 py-2",
        "rounded-md border border-transparent shadow-sm",
        "text-sm font-medium text-gray-100",
        "transition-colors",
        "cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        isLoading
            ? buttonVariantClasses[variant].loading
            : buttonVariantClasses[variant].idle,
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
        className,
    );

const buttonVariantClasses: ButtonVariantClasses = {
    activeTab: {
        idle: tw`bg-slate-200 text-gray-900`,
        loading: tw`cursor-wait bg-slate-200 text-gray-900`,
    },
    danger: {
        idle: tw`bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 active:bg-red-800 not-disabled:active:scale-[0.98]`,
        loading: tw`cursor-wait bg-red-400`,
    },
    inactiveTab: {
        idle: tw`bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-gray-800 focus-visible:ring-amber-500`,
        loading: tw`cursor-wait bg-slate-100 text-gray-600`,
    },
    primary: {
        idle: tw`bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500 active:bg-amber-800 not-disabled:active:scale-[0.98]`,
        loading: tw`cursor-wait bg-amber-400`,
    },
    secondary: {
        idle: tw`bg-gray-600 hover:bg-gray-700 focus-visible:ring-gray-500 active:bg-gray-800 not-disabled:active:scale-[0.98]`,
        loading: tw`cursor-wait bg-gray-400`,
    },
    warning: {
        idle: tw`bg-orange-600 hover:bg-orange-700 focus-visible:ring-orange-500 active:bg-orange-800 not-disabled:active:scale-[0.98]`,
        loading: tw`cursor-wait bg-orange-400`,
    },
};

function Button({
    children,
    className,
    isLoading,
    variant = "primary",
    ...props
}: ButtonProps): JSX.Element {
    return (
        <button
            className={buttonClasses(!!isLoading, variant, className)}
            disabled={isLoading}
            {...props}
        >
            <div className="flex flex-row items-center align-bottom">
                {isLoading && (
                    <div className="mr-2 inline-flex">
                        <SpinnerIcon />
                    </div>
                )}
                <div className="flex-1">
                    {isLoading ? "Itxaron..." : children}
                </div>
            </div>
        </button>
    );
}

export { Button };
