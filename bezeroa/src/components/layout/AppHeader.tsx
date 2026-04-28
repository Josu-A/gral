import { clsx } from "clsx";
import { type JSX } from "react";
import { Link, NavLink } from "react-router-dom";

import { CogIcon } from "@/components/icon/Cog";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

import { LogoutIcon } from "../icon/Logout";
import { UserIcon } from "../icon/User";

function AppHeader(): JSX.Element {
    return (
        <header className="border-b-2 border-slate-300 px-6 py-3">
            <div className="grid grid-cols-2 items-center gap-1 sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
                <Link
                    className="justify-self-start text-xl font-bold text-amber-600"
                    to="/"
                >
                    GrAL
                </Link>
                <nav className="col-span-2 row-start-2 flex items-center justify-center divide-x divide-slate-400 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-self-center [&>:not(:first-child)]:pl-2 [&>:not(:last-child)]:pr-2">
                    <NavLink className={isActiveLink} to="/">
                        Ariketak
                    </NavLink>
                    <NavLink className={isActiveLink} to="/profile">
                        Aurrerapena
                    </NavLink>
                </nav>
                <DropdownMenu
                    triggerElement={(props) => (
                        <Button
                            className="col-start-2 row-start-1 w-auto justify-self-end px-2! py-2! sm:col-start-3"
                            variant="primary"
                            {...props}
                        >
                            <CogIcon />
                        </Button>
                    )}
                >
                    <Link to="/profile">
                        <UserIcon />
                        Profila
                    </Link>
                    <Link to="/logout">
                        <LogoutIcon />
                        Saioa itxi
                    </Link>
                </DropdownMenu>
            </div>
        </header>
    );
}

function isActiveLink({ isActive }: { isActive: boolean }): string {
    return clsx("text-md", "font-medium", { "text-amber-600": isActive });
}

export default AppHeader;
