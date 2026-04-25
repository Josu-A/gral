import type { JSX } from 'react';

import AuthProvider from '@/provider/authProvider';
import Routes from '@/routes';

function App(): JSX.Element {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
}

export default App
