import { type JSX, type ReactNode } from "react";
import { Outlet } from "react-router-dom";

import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

interface AppLayoutProps {
    children?: ReactNode;
}

function AppLayout({ children }: AppLayoutProps): JSX.Element {
    return (
        <div className="flex min-h-full flex-col">
            <AppHeader />
            <main className="flex-1">{children ?? <Outlet />}</main>
            <AppFooter />
        </div>
    );
}

export default AppLayout;
