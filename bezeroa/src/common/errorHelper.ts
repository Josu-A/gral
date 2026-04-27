import axios from "axios";

export type FieldErrors = Record<string, string>;

function handleApiError(err: unknown, genericMessage: string): FieldErrors {
    if (!axios.isAxiosError(err)) {
        return { general: "Ustekabeko errore bat gertatu da" };
    }
    const responseData = err.response?.data;
    if (!responseData) {
        return { general: genericMessage };
    }
    if (responseData.error === "VALIDATION_ERROR") {
        const fieldErrors: Record<string, string> = {};
        responseData.issues?.forEach(
            (issue: { message: string; path: string }) => {
                fieldErrors[issue.path] = fieldErrors[issue.path]
                    ? `${fieldErrors[issue.path]}\n${issue.message}`
                    : issue.message;
            },
        );
        return fieldErrors;
    }
    return { general: responseData.error || genericMessage };
}

export { handleApiError };
