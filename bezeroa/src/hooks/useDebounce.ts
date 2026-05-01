import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const timeoutHandle = setTimeout(() => {
            setDebounced(value);
        }, delay);
        return () => {
            clearTimeout(timeoutHandle);
        };
    }, [value, delay]);

    return debounced;
}

export { useDebounce };
