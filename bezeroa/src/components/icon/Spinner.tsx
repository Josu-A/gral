import type { JSX } from "react";

interface SpinnerProps {
    className?: string;
}

function SpinnerIcon({ className = "h-5 w-5" }: SpinnerProps): JSX.Element {
    return (
        <svg
            className={`animate-spin ${className} `}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeDasharray="14 42"
                strokeLinecap="round"
                strokeWidth="3.5"
            />
            <circle
                cx="12"
                cy="12"
                opacity="0.2"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
            />
        </svg>
    );
}

export { SpinnerIcon };
