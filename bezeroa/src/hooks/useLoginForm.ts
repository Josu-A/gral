import { useState } from "react";

interface FormErrors {
    general?: string;
    helbide_elektronikoa?: string;
    pasahitza?: string;
}

function useLoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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

    const validate = (): boolean => {
        const validationErrors: FormErrors = {};
        if (!email.includes("@")) {
            validationErrors.helbide_elektronikoa =
                "Helbide elektronikoa ez da baliozkoa";
        }
        if (!password.trim()) {
            validationErrors.pasahitza = "Pasahitza huts dago";
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return {
        clearError,
        email,
        errors,
        handleEmailBlur,
        password,
        setEmail,
        setErrors,
        setPassword,
        validate,
    };
}

export { useLoginForm };
