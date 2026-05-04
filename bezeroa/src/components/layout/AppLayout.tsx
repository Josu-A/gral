import clsx from "clsx";
import { type JSX, type ReactNode } from "react";
import { Outlet, useMatches } from "react-router-dom";

import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

type AppHandle = {
    fillViewport?: boolean;
};

interface AppLayoutProps {
    children?: ReactNode;
}

function AppLayout({ children }: AppLayoutProps): JSX.Element {
    const matches = useMatches();
    const fillViewport = matches.some(
        (m) => (m.handle as AppHandle)?.fillViewport,
    );
    const mainClasses = clsx("flex-1", fillViewport && "sm:min-h-0");
    return (
        <div className="flex h-full flex-col">
            <AppHeader />
            <main className={mainClasses}>{children ?? <Outlet />}</main>
            <AppFooter />
        </div>
    );
}

export default AppLayout;
