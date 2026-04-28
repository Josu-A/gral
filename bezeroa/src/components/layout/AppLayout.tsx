import { type JSX } from "react";
import { Outlet } from "react-router-dom";

import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

function AppLayout(): JSX.Element {
    return (
        <div className="flex min-h-full flex-col">
            <AppHeader />
            <main className="flex-1">
                <Outlet />
            </main>
            <AppFooter />
        </div>
    );
}

export default AppLayout;
