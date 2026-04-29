import type { JSX } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import SignUp from "@/pages/SignUp";
import { GuestRoute } from "@/routes/GuestRoute";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RootIndexRoute } from "@/routes/RootIndexRoute";

const router = createBrowserRouter([
    {
        element: <div>About us</div>,
        path: "/about",
    },
    {
        element: <RootIndexRoute />,
        path: "/",
    },
    {
        element: <Logout />,
        path: "logout",
    },
    {
        children: [
            {
                children: [
                    {
                        element: <div>User profile</div>,
                        path: "profile",
                    },
                ],
                element: <AppLayout />,
            },
        ],
        element: <ProtectedRoute />,
    },
    {
        children: [
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
        ],
        element: <GuestRoute />,
    },
]);

function Routes(): JSX.Element {
    return <RouterProvider router={router} />;
}

export default Routes;
