import { useState } from "react";

import type { IkasketaMaila } from "@/common/types/entities";

interface FormErrors {
    general?: string;
    gogoko_lengoaia?: string;
    ikasketa_maila?: string;
    nire_mailakoak_ikusi?: string;
}

function useUpdateEducationForm() {
    const [educationLevel, setEducationLevel] = useState<"" | IkasketaMaila>(
        "",
    );
    const [showMySameLevel, setShowMySameLevel] = useState<boolean>(false);
    const [preferredProgrammingLanguage, setPreferredProgrammingLanguage] =
        useState<string>("");
    const [updateEducationErrors, setUpdateEducationErrors] =
        useState<FormErrors>({});

    const clearUpdateEducationError = (field: keyof FormErrors): void => {
        if (updateEducationErrors[field]) {
            setUpdateEducationErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const validateUpdateEducation = (): boolean => {
        const validationErrors: FormErrors = {};

        if (!educationLevel) {
            validationErrors.ikasketa_maila =
                "Ikasketa maila aukeratu behar duzu";
        }

        setUpdateEducationErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return {
        clearUpdateEducationError,
        educationLevel,
        preferredProgrammingLanguage,
        setEducationLevel,
        setPreferredProgrammingLanguage,
        setShowMySameLevel,
        setUpdateEducationErrors,
        showMySameLevel,
        updateEducationErrors,
        validateUpdateEducation,
    };
}

export { useUpdateEducationForm };
