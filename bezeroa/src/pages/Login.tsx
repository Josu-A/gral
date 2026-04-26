import axios from 'axios';
import { type JSX, type SubmitEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { LocationState } from '@/common/types';

import apiClient from '@/common/apiClient';
import { useAuth } from '@/hooks/useAuth';

interface LoginResponse {
    data: {
        accessToken: string;
    };
    success: boolean;
}

function Login(): JSX.Element {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{
        email?: string;
        general?: string
        password?: string;
    }>({});

    const state: LocationState | null = location.state;
    const from = state?.from?.pathname || '/';

    async function handleLogin(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const response = await apiClient.post<LoginResponse>(
                "/auth/login",
                {
                    helbide_elektronikoa: email,
                    pasahitza: password,
                }
            );

            setToken(response.data.data.accessToken);
            navigate(from, { replace: true });
        }
        catch (err: unknown) {
            if (axios.isAxiosError<{ error: string }>(err)) {
                const message = err.response?.data?.error || 'Akats bat gertatu da saioa hastean';
                setErrors({ general: message });
            }
            else {
                setErrors({ general: 'Ustekabeko errore bat gertatu da' });
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const inputGroupClasses = "flex flex-col";
    const labelClasses = "text-sm font-medium text-gray-800";
    const inputClasses = (hasError: boolean) => `
        mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors
        focus:outline-none focus:ring-2 focus:ring-amber-500
        ${hasError
            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 bg-white focus:border-amber-500'
        }
        disabled:bg-gray-50 disabled:text-gray-500
    `;

    return (
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div className={inputGroupClasses}>
                <label className={labelClasses} htmlFor="email">
                    Helbide elektronikoa
                </label>
                <input
                    autoComplete='email'
                    className={inputClasses(!!errors.email)}
                    disabled={isLoading}
                    id="email"
                    inputMode="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    value={email}
                />
                {errors.email && (
                    <span className="mt-1 text-xs text-red-600">
                        {errors.email}
                    </span>
                )}
            </div>

            <div className={inputGroupClasses}>
                <label className={labelClasses} htmlFor="password">
                    Pasahitza
                </label>
                <input
                    autoComplete='current-password'
                    className={inputClasses(!!errors.password)}
                    disabled={isLoading}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    value={password}
                />
                {errors.password && (
                    <span className="mt-1 text-xs text-red-600">
                        {errors.password}
                    </span>
                )}
            </div>

            {errors.general && (
                <div className='rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200'>
                    {errors.general}
                </div>
            )}

            <button disabled={isLoading} type="submit">
                {isLoading ? 'Saioa hasten...' : 'Saioa hasi'}
            </button>
        </form>
    );
}

export default Login;
