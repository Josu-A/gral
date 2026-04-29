import type { JSX } from "react";

import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";

function RootIndexRoute(): JSX.Element {
    const { token } = useAuth();
    if (token) {
        return (
            <AppLayout>
                <div>User home page</div>
            </AppLayout>
        );
    }
    return <Home />;
}

export { RootIndexRoute };
