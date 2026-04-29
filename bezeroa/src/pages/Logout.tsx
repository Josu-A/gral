import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "@/common/apiClient";
import { useAuth } from "@/hooks/useAuth";

function Logout() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await apiClient.post(
                    "/auth/logout",
                    {},
                    { withCredentials: true },
                );
            } catch (error) {
                console.error("Error while logging out on server-side:", error);
            } finally {
                setToken(null);
                navigate("/", { replace: true });
            }
        };

        logout();
    }, [navigate, setToken]);

    return null;
}

export default Logout;
