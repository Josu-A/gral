import { useContext } from 'react';

import type { AuthContextType } from '@/common/types';

import { AuthContext } from '@/provider/authProvider';

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider component');
    }
    return context;
}

export {
    useAuth
};