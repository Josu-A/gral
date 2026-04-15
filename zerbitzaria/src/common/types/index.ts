interface IApiResponse<T = void> {
    data?: T;
    error?: string;
    success: boolean;
};

export type {
    IApiResponse
};
