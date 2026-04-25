import { type JSX } from 'react';
import { Outlet, useMatches } from 'react-router-dom';

type AuthHandle = {
    titulua?: string;
};

function AuthLayout(): JSX.Element {
    const matches = useMatches();
    const lastRouteWithHandle = [...matches].reverse().find(m => m.handle);
    const titulua = (lastRouteWithHandle?.handle as AuthHandle)?.titulua ?? 'Ongi etorri';

    return (
        <div className="flex min-h-full items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">GrAL</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Programazio-ikasleentzako laguntza pedagogikoa
                    </p>
                </div>
                <div className="rounded-lg bg-white p-8 shadow">
                    <h2 className="mb-1 text-xl font-semibold text-gray-900">{titulua}</h2>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;