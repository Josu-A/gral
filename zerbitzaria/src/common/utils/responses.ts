import type { IApiResponse } from "@common/types";

function formatError(error: string): IApiResponse {
    return {
        error,
        success: false
    };
}

function formatSuccess<T>(data: T): IApiResponse<T> {
    return {
        data,
        success: true
    };
}

export {
    formatError,
    formatSuccess
};
