import type { JSX } from "react";

import {
    createBrowserRouter,
    type RouteObject,
    RouterProvider,
} from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { Logout } from "@/pages/Logout";
import SignUp from "@/pages/SignUp";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

function Routes(): JSX.Element {
    const { token } = useAuth();
    const routesForPublic: RouteObject[] = [
        {
            element: <div>About us</div>,
            path: "/about",
        },
    ];
    const routesForAuthenticated: RouteObject[] = [
        {
            children: [
                {
                    children: [
                        {
                            element: <div>User home page</div>,
                            path: "/",
                        },
                        {
                            element: <div>User profile</div>,
                            path: "profile",
                        },
                    ],
                    element: <AppLayout />,
                },
                {
                    element: <Logout />,
                    path: "logout",
                },
            ],
            element: <ProtectedRoute />,
            path: "/",
        },
    ];
    const routesForNonAuthenticated: RouteObject[] = [
        {
            element: <Home />,
            path: "/",
        },
        {
            children: [
                {
                    element: <Login />,
                    handle: { titulua: "Saioa hasi" },
                    path: "login",
                },
                {
                    element: <SignUp />,
                    handle: { titulua: "Erregistratu" },
                    path: "signup",
                },
            ],
            element: <AuthLayout />,
        },
    ];

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNonAuthenticated : []),
        ...routesForAuthenticated,
    ]);

    return <RouterProvider router={router} />;
}

export default Routes;
