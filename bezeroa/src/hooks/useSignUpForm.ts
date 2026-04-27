import { useState } from "react";

import type { IkasketaMaila } from "@/common/types/entities";

interface FormErrors {
    confirmPassword?: string;
    educationLevel?: string;
    email?: string;
    general?: string;
    name?: string;
    password?: string;
}

function useSignUpForm() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [educationLevel, setEducationLevel] = useState<"" | IkasketaMaila>(
        "",
    );
    const [errors, setErrors] = useState<FormErrors>({});

    const clearError = (field: keyof FormErrors): void => {
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleEmailBlur = (): void => {
        if (email.length > 0 && !email.includes("@")) {
            setErrors((prev) => ({
                ...prev,
                email: "Helbide elektronikoa ez da baliozkoa",
            }));
        }
    };

    const handleNameBlur = (): void => {
        if (!name.trim()) {
            setErrors((prev) => ({
                ...prev,
                name: "Izena ezin da hutsik egon",
            }));
        }
    };

    const handleConfirmPasswordBlur = (): void => {
        if (confirmPassword !== password) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: "Pasahitzak ez dira berdinak",
            }));
        }
    };

    const validate = (): boolean => {
        const validationErrors: FormErrors = {};
        if (!email.includes("@")) {
            validationErrors.email = "Helbide elektronikoa ez da baliozkoa";
        }
        if (!name.trim()) {
            validationErrors.name = "Izena ezin da hutsik egon";
        }
        if (!password.trim()) {
            validationErrors.password = "Pasahitza huts dago";
        }
        if (!confirmPassword.trim()) {
            validationErrors.confirmPassword = "Berretsi pasahitza";
        }
        if (confirmPassword.trim() && password !== confirmPassword) {
            validationErrors.confirmPassword = "Pasahitzak ez dira berdinak";
        }
        if (!educationLevel) {
            validationErrors.educationLevel =
                "Ikasketa maila aukeratu behar duzu";
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return {
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
    };
}

export { useSignUpForm };
