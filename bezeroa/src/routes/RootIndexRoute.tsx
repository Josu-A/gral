import type { JSX } from "react";

import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import Exercises from "@/pages/Exercises";
import Home from "@/pages/Home";

function RootIndexRoute(): JSX.Element {
    const { token } = useAuth();
    if (token) {
        return (
            <AppLayout>
                <Exercises />
            </AppLayout>
        );
    }
    return <Home />;
}

export { RootIndexRoute };
