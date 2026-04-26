import { useState } from 'react';

interface FormErrors {
    email?: string;
    general?: string;
    password?: string;
}

function useLoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});

    const clearError = (field: keyof FormErrors): void => {
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleEmailBlur = (): void => {
        if (email.length > 0 && !email.includes('@')) {
            setErrors(prev => ({
                ...prev,
                email: 'Helbide elektronikoa ez da baliozkoa'
            }));
        }
    };

    const validate = (): boolean => {
        const validationErrors: FormErrors = {};
        if (!email.includes('@')) {
            validationErrors.email = 'Helbide elektronikoa ez da baliozkoa';
        }
        if (!password.trim()) {
            validationErrors.password = 'Pasahitza huts dago';
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
        validate
    };
}

export {
    useLoginForm
}