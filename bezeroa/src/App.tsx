import type { JSX } from "react";

import { Toaster } from "sonner";

import AuthProvider from "@/provider/authProvider";
import Routes from "@/routes";

function App(): JSX.Element {
    return (
        <AuthProvider>
            <Toaster position="top-center" richColors />
            <Routes />
        </AuthProvider>
    );
}

export default App;
