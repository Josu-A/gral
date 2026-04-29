import type { JSX } from "react";

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

function GuestRoute(): JSX.Element {
    const { token } = useAuth();

    if (token) {
        return <Navigate replace to="/" />;
    }
    return <Outlet />;
}

export { GuestRoute };
