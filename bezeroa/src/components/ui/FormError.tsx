import type { JSX } from 'react';

import clsx from 'clsx';

const errorBoxClasses = (className?: string): string => clsx(
    'rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700',
    'mt-4',
    className
);

interface FormErrorProps {
    className?: string;
    message?: string;
}

function FormError({ className, message }: FormErrorProps): JSX.Element | null {
    if (!message) {
        return null;
    }
    return (
        <div className={errorBoxClasses(className)}>
            {message}
        </div>
    );
}

export {
    FormError
};