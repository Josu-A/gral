import { useState } from "react";

import type { IkasketaMaila } from "@/common/types/entities";

interface FormErrors {
    general?: string;
    helbide_elektronikoa?: string;
    ikasketa_maila?: string;
    izena?: string;
    pasahitza?: string;
    pasahitza_errepikatu?: string;
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
            validationErrors.helbide_elektronikoa =
                "Helbide elektronikoa ez da baliozkoa";
        }
        if (!name.trim()) {
            validationErrors.izena = "Izena ezin da hutsik egon";
        }
        if (!password.trim()) {
            validationErrors.pasahitza = "Pasahitza huts dago";
        }
        if (!confirmPassword.trim()) {
            validationErrors.pasahitza_errepikatu = "Berretsi pasahitza";
        }
        if (confirmPassword.trim() && password !== confirmPassword) {
            validationErrors.pasahitza_errepikatu =
                "Pasahitzak ez dira berdinak";
        }
        if (!educationLevel) {
            validationErrors.ikasketa_maila =
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
