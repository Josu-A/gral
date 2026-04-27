interface AuthContextType {
    isLoading: boolean;
    setToken: (newToken: null | string) => void;
    token: null | string;
}

interface LocationState {
    from?: {
        pathname: string;
    };
}

const tw = (
    strings: TemplateStringsArray,
    ...values: readonly (
        | bigint
        | boolean
        | null
        | number
        | string
        | undefined
    )[]
): string => String.raw({ raw: strings }, ...values);

export { tw };

export type { AuthContextType, LocationState };
