import axios from "axios";
import { type JSX, type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { IkasketaMaila } from "@/common/types/entities";

import apiClient from "@/common/apiClient";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useSignUpForm } from "@/hooks/useSignUpForm";

interface SignUpResponse {
    data: {
        message: string;
    };
    success: boolean;
}

const MAILAK: {
    label: string;
    value: IkasketaMaila;
}[] = [
    { label: "Hasiberria", value: "Hasiberria" },
    { label: "Ertaina", value: "Ertaina" },
    { label: "Aurreratua", value: "Aurreratua" },
];

function SignUp(): JSX.Element {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        clearError,
        confirmPassword,
        educationLevel,
        email,
        errors,
        handleConfirmPasswordBlur,
        handleEmailBlur,
        handleNameBlur,
        name,
        password,
        setConfirmPassword,
        setEducationLevel,
        setEmail,
        setErrors,
        setName,
        setPassword,
        validate,
    } = useSignUpForm();

    async function handleSignUp(
        e: SubmitEvent<HTMLFormElement>,
    ): Promise<void> {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await apiClient.post<SignUpResponse>(
                "/auth/register",
                {
                    helbide_elektronikoa: email,
                    ikasketa_maila: educationLevel,
                    izena: name,
                    pasahitza: password,
                    pasahitza_errepikatu: confirmPassword,
                },
            );
            navigate("/login");
            toast.success(response.data.data.message);
        } catch (err: unknown) {
            const message = axios.isAxiosError<{ error: string }>(err)
                ? err.response?.data?.error ||
                  "Akats bat gertatu da erregistratzean"
                : "Ustekabeko errore bat gertatu da";
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="mt-6 space-y-4" noValidate onSubmit={handleSignUp}>
            <Input
                autoComplete="email"
                disabled={isLoading}
                error={errors.email}
                inputMode="email"
                label="Helbide elektronikoa"
                onBlur={handleEmailBlur}
                onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                }}
                required
                type="email"
                value={email}
            />
            <Input
                autoComplete="name"
                disabled={isLoading}
                error={errors.name}
                inputMode="text"
                label="Izena"
                onBlur={handleNameBlur}
                onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                }}
                required
                type="text"
                value={name}
            />
            <Input
                autoComplete="current-password"
                disabled={isLoading}
                error={errors.password}
                label="Pasahitza"
                onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                }}
                required
                type="password"
                value={password}
            />
            <Input
                autoComplete="current-password"
                disabled={isLoading}
                error={errors.confirmPassword}
                label="Errepikatu pasahitza"
                onBlur={handleConfirmPasswordBlur}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                }}
                required
                type="password"
                value={confirmPassword}
            />
            <Select
                disabled={isLoading}
                error={errors.educationLevel}
                label="Ikasketa maila"
                onChange={(value) => {
                    setEducationLevel(value);
                    clearError("educationLevel");
                }}
                options={MAILAK}
                required
                value={educationLevel}
            />

            <FormError message={errors.general} />

            <div className="flex w-full flex-col items-center space-y-4">
                <Button
                    className="w-full sm:w-auto sm:px-12"
                    isLoading={isLoading}
                    type="submit"
                    variant="primary"
                >
                    Erregistratu
                </Button>
                <div className="flex w-full flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8">
                    <Link className="link-primary" to="/login">
                        Kontua baduzu?
                    </Link>
                </div>
            </div>
        </form>
    );
}

export default SignUp;
