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

export type {
    AuthContextType,
    LocationState
};