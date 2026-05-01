import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "@/common/apiClient";
import { useAuth } from "@/hooks/useAuth";

function Logout() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const logout = async (): Promise<void> => {
            try {
                await apiClient.post(
                    "/auth/logout",
                    {},
                    { signal: controller.signal, withCredentials: true },
                );
            } catch (error) {
                console.error("Error while logging out on server-side:", error);
            } finally {
                setToken(null);
                navigate("/", { replace: true });
            }
        };

        logout();

        return () => controller.abort();
    }, [navigate, setToken]);

    return null;
}

export default Logout;
