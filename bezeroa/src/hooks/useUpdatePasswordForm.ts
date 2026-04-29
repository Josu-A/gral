import { useState } from "react";

interface FormErrors {
    general?: string;
    pasahitza_berria?: string;
    pasahitza_errepikatu?: string;
    pasahitza_zaharra?: string;
}

function useUpdatePasswordForm() {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [updatePasswordErrors, setUpdatePasswordErrors] =
        useState<FormErrors>({});

    const clearUpdatePasswordError = (field: keyof FormErrors): void => {
        if (updatePasswordErrors[field]) {
            setUpdatePasswordErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleOldPasswordBlur = (): void => {
        if (!oldPassword.trim()) {
            setUpdatePasswordErrors((prev) => ({
                ...prev,
                pasahitza_zaharra: "Pasahitz zaharra ezin da hutsik egon",
            }));
        }
    };

    const handleNewPasswordBlur = (): void => {
        if (!newPassword.trim()) {
            setUpdatePasswordErrors((prev) => ({
                ...prev,
                pasahitza_berria: "Pasahitz huts dago",
            }));
        }
    };

    const handleConfirmPasswordBlur = (): void => {
        if (confirmPassword !== newPassword) {
            setUpdatePasswordErrors((prev) => ({
                ...prev,
                pasahitza_errepikatu: "Berretsi pasahitza",
            }));
        }
    };

    const validateUpdatePassword = (): boolean => {
        const validationErrors: FormErrors = {};
        if (!oldPassword.trim()) {
            validationErrors.pasahitza_zaharra = "Pasahitz zaharra hutsik dago";
        }
        if (!newPassword.trim()) {
            validationErrors.pasahitza_berria = "Pasahitz huts dago";
        }
        if (!confirmPassword.trim()) {
            validationErrors.pasahitza_errepikatu = "Berretsi pasahitza";
        }
        if (confirmPassword.trim() && newPassword !== confirmPassword) {
            validationErrors.pasahitza_errepikatu =
                "Pasahitzak ez dira berdinak";
        }
        setUpdatePasswordErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return {
        clearUpdatePasswordError,
        confirmPassword,
        handleConfirmPasswordBlur,
        handleNewPasswordBlur,
        handleOldPasswordBlur,
        newPassword,
        oldPassword,
        setConfirmPassword,
        setNewPassword,
        setOldPassword,
        setUpdatePasswordErrors,
        updatePasswordErrors,
        validateUpdatePassword,
    };
}

export { useUpdatePasswordForm };
