import axios, {
    type AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from 'axios';

interface InternalAxiosRetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let accesToken: null | string = null;
let refreshAccessTokenPromise: null | Promise<void> = null;

function getAccessToken(): null | string {
    return accesToken;
}

async function refreshAccessToken(): Promise<void> {
    if (refreshAccessTokenPromise) {
        return refreshAccessTokenPromise;
    }
    refreshAccessTokenPromise = apiClient.post<{ data: { accessToken: string } }>(
        '/auth/refresh',
        {},
        { withCredentials: true }
    )
    .then((response) => {
        setAccessToken(response.data.data.accessToken);
    })
    .finally(() => {
        refreshAccessTokenPromise = null;
    });

    return refreshAccessTokenPromise;
}

function setAccessToken(token: null | string): void {
    accesToken = token;
}

const apiClient: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_API_PATH}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (accesToken) {
        config.headers.Authorization = `Bearer ${accesToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRetryableRequestConfig | undefined;
        if (!originalRequest
            || originalRequest._retry
            || error.response?.status !== 401
            || originalRequest.url?.includes('/auth/login')
            || originalRequest.url?.includes('/auth/refresh')
        ) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;
        try {
            await refreshAccessToken();
            return apiClient(originalRequest);
        }
        catch (refreshError) {
            setAccessToken(null);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
);

export default apiClient;
export {
    getAccessToken,
    setAccessToken
};