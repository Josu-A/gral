import type { JSX } from "react";

import {
    createBrowserRouter,
    type RouteObject,
    RouterProvider
} from "react-router-dom";

//import { Logout } from "@/pages/Logout";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

function Routes(): JSX.Element {
    const { token } = useAuth();
    const routesForPublic: RouteObject[] = [
        {
            element: <div>About us</div>,
            path: "/about"
        }
    ];
    const routesForAuthenticated: RouteObject[] = [
        {
            children: [
                {
                    element: <div>User home page</div>,
                    path: "/"
                },
                {
                    element: <div>User profile</div>,
                    path: "/profile"
                },
                {
                    element: <div>Logout</div>,
                    path: "/logout"
                }
            ],
            element: <ProtectedRoute />,
            path: "/"
        }
    ];
    const routesForNonAuthenticated: RouteObject[] = [
        {
            element: <div>Home page</div>,
            path: "/"
        },
        {
            children: [
                {
                    element: <Login />,
                    handle: { titulua: 'Saioa hasi' },
                    path: "login"
                },
                {
                    element: <div>Register</div>,
                    handle: { titulua: 'Erregistratu' },
                    path: "register"
                }
            ],
            element: <AuthLayout />
        }
    ];

    const router = createBrowserRouter([
        ...routesForPublic,
        ...(!token ? routesForNonAuthenticated : []),
        ...routesForAuthenticated
    ]);

    return <RouterProvider router={router} />;
}

export default Routes;