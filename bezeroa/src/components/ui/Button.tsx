import clsx from 'clsx';
import { type ButtonHTMLAttributes, type JSX } from 'react';

import type { ComponentVariant } from '@/components/ui/types';

import { Spinner } from '@/components/ui/Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: ComponentVariant;
}

type ButtonVariantClasses = Record<ComponentVariant, {
    idle: string;
    loading: string;
}>

const buttonClasses = (isLoading: boolean, variant: ComponentVariant, className?: string): string => clsx(
    'flex w-full justify-center px-4 py-2',
    'rounded-md border border-transparent shadow-sm',
    'text-sm font-medium text-gray-100',
    'transition-colors',
    'focus:ring-2 focus:ring-offset-2 focus:outline-none',
    isLoading
        ? buttonVariantClasses[variant].loading
        : buttonVariantClasses[variant].idle,
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    className
);

const buttonVariantClasses: ButtonVariantClasses = {
    primary: {
        idle: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 active:bg-amber-800 not-disabled:active:scale-[0.98]',
        loading: 'bg-amber-400 cursor-wait',
    },
    secondary: {
        idle: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800 not-disabled:active:scale-[0.98]',
        loading: 'bg-gray-400 cursor-wait',
    }
};

function Button({children, className, isLoading, variant='primary', ...props}: ButtonProps): JSX.Element {
    return (
        <button
            className={buttonClasses(!!isLoading, variant, className)}
            disabled={isLoading}
            {...props}
        >
            <div className="flex flex-row items-center align-bottom">
                {isLoading && (
                    <div className="mr-2 inline-flex">
                        <Spinner />
                    </div>
                )}
                <div className='flex-1'>
                    {isLoading ? 'Itxaron...' : children}
                </div>
            </div>
        </button>
    );
}

export {
    Button
}