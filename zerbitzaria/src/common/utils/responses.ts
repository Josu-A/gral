import type { IApiResponse } from "@common/types";

function formatError(
    error: string,
    issues?: { message: string; path: string }[],
): IApiResponse {
    return {
        error,
        issues,
        success: false,
    };
}

function formatSuccess<T>(data: T): IApiResponse<T> {
    return {
        data,
        success: true,
    };
}

export { formatError, formatSuccess };
