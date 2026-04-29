import { useState } from "react";

interface FormErrors {
    general?: string;
    izena?: string;
}

function useUpdatePersonalDataForm() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [updatePersonalDataErrors, setUpdatePersonalDataErrors] =
        useState<FormErrors>({});

    const clearUpdatePersonalDataError = (field: keyof FormErrors): void => {
        if (updatePersonalDataErrors[field]) {
            setUpdatePersonalDataErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleNameBlur = (): void => {
        if (!name.trim()) {
            setUpdatePersonalDataErrors((prev) => ({
                ...prev,
                name: "Izena ezin da hutsik egon",
            }));
        }
    };

    const validateUpdatePersonalData = (): boolean => {
        const validationErrors: FormErrors = {};

        if (!name.trim()) {
            validationErrors.izena = "Izena huts dago";
        }
        setUpdatePersonalDataErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return {
        clearUpdatePersonalDataError,
        email,
        handleNameBlur,
        name,
        setEmail,
        setName,
        setUpdatePersonalDataErrors,
        updatePersonalDataErrors,
        validateUpdatePersonalData,
    };
}

export { useUpdatePersonalDataForm };
