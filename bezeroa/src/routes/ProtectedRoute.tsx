import type { JSX } from "react";

import { Navigate, Outlet, useLocation } from "react-router-dom";

import type { LocationState } from "@/common/types";

import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute(): JSX.Element {
    const { token } = useAuth();
    const location = useLocation();

    const state: LocationState = {
        from: {
            pathname: location.pathname
        }
    }

    if (!token) {
        return <Navigate replace state={state} to="/login" />;
    }
    return <Outlet />;
}

export {
    ProtectedRoute
};