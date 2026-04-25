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
    const [error, setError] = useState<null | string>(null);

    const state: LocationState | null = location.state;
    const from = state?.from?.pathname || '/';

    async function handleLogin(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
                setError(message);
            }
            else {
                setError('Ustekabeko errore bat gertatu da');
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
                <label htmlFor="email">Helbide elektronikoa</label>
                <input
                    autoComplete='email'
                    disabled={isLoading}
                    id="email"
                    inputMode="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    value={email}
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Pasahitza</label>
                <input
                    autoComplete='current-password'
                    disabled={isLoading}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    value={password}
                />
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <button disabled={isLoading} type="submit">
                {isLoading ? 'Saioa hasten...' : 'Saioa hasi'}
            </button>
        </form>
    );
}

export default Login;