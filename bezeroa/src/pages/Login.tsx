import axios from "axios";
import { type JSX, type SubmitEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import type { LocationState } from "@/common/types";

import apiClient from "@/common/apiClient";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useLoginForm } from "@/hooks/useLoginForm";

interface LoginResponse {
    data?: {
        accessToken: string;
    };
    error?: string;
    issues?: {
        message: string;
        path: string;
    }[];
    success: boolean;
}

const ERROR_GENERIC = "Akats bat gertatu da saioa hastean";

function Login(): JSX.Element {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const state: LocationState | null = location.state;
    const from = state?.from?.pathname || "/";

    const {
        clearError,
        email,
        errors,
        handleEmailBlur,
        password,
        setEmail,
        setErrors,
        setPassword,
        validate,
    } = useLoginForm();

    async function handleLogin(e: SubmitEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await apiClient.post<LoginResponse>(
                "/auth/login",
                {
                    helbide_elektronikoa: email,
                    pasahitza: password,
                },
            );
            if (!response.data.data?.accessToken) {
                setErrors({ general: response.data.error || ERROR_GENERIC });
                return;
            }
            setToken(response.data.data.accessToken);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            if (!axios.isAxiosError<LoginResponse>(err)) {
                setErrors({ general: "Ustekabeko errore bat gertatu da" });
                return;
            }
            const responseData = err.response?.data;
            if (!responseData) {
                setErrors({ general: ERROR_GENERIC });
                return;
            }
            if (responseData.error === "VALIDATION_ERROR") {
                const fieldErrors: Record<string, string> = {};
                responseData.issues?.forEach((issue) => {
                    fieldErrors[issue.path] = fieldErrors[issue.path]
                        ? `${fieldErrors[issue.path]}\n${issue.message}`
                        : issue.message;
                });
                setErrors(fieldErrors);
            } else {
                setErrors({ general: responseData.error || ERROR_GENERIC });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="mt-6 space-y-4" noValidate onSubmit={handleLogin}>
            <Input
                autoComplete="email"
                disabled={isLoading}
                error={errors.helbide_elektronikoa}
                inputMode="email"
                label="Helbide elektronikoa"
                onBlur={handleEmailBlur}
                onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("helbide_elektronikoa");
                }}
                required
                type="email"
                value={email}
            />
            <Input
                autoComplete="current-password"
                disabled={isLoading}
                error={errors.pasahitza}
                label="Pasahitza"
                onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("pasahitza");
                }}
                required
                type="password"
                value={password}
            />

            <FormError message={errors.general} />

            <div className="flex w-full flex-col items-center space-y-4">
                <Button
                    className="w-full sm:w-auto sm:px-12"
                    isLoading={isLoading}
                    type="submit"
                    variant="primary"
                >
                    Saioa hasi
                </Button>
                <div className="flex w-full flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8">
                    <Link className="link-primary" to="/forgot-password">
                        Pasahitza ahaztu duzu?
                    </Link>
                    <Link className="link-primary" to="/signup">
                        Ez duzu konturik?
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default Login;
