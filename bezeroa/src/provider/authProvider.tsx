import {
    createContext,
    type JSX,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { AuthContextType } from "@/common/types";

import {
    getAccessToken,
    refreshAccessToken,
    setAccessToken,
} from "@/common/apiClient";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [token, setToken_] = useState<null | string>(getAccessToken());
    const [isLoading, setIsLoading] = useState(true);

    const setToken = useCallback((newToken: null | string) => {
        setAccessToken(newToken);
        setToken_(newToken);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (!getAccessToken()) {
                    await refreshAccessToken();
                    setToken(getAccessToken());
                }
            } catch {
                setToken(null);
                console.error("Error refreshing access token:");
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, [setToken]);

    const contextValue = useMemo(
        () => ({
            isLoading,
            setToken,
            token,
        }),
        [isLoading, setToken, token],
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading ? children : <div>Kargatzen...</div>}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export { AuthContext };
