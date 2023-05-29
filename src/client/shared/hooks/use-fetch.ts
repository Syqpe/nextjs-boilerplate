import { AxiosRequestConfig } from 'axios';
import { useState, useCallback } from 'react';

import { FetchStatus } from 'src/client/shared/types/fetch-status';
import { APIError } from 'src/client/shared/utils/api-error';
import { fetch } from 'src/client/shared/utils/fetch';

interface FetchParams {
    path: string;
    options?: AxiosRequestConfig;
}

interface FetchResult<T> {
    status: FetchStatus | null;
    error: APIError | null;
    response: T | null;
    call(): void;
}

export function useFetch<T>(params: FetchParams): FetchResult<T> {
    const { path, options } = params;

    const [status, setStatus] = useState<FetchStatus | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const [response, setResponse] = useState<T | null>(null);

    const onSuccess = useCallback((response: T) => {
        setResponse(response);
        setError(null);
        setStatus(FetchStatus.SUCCESS);
    }, []);

    const onFailure = useCallback((error: APIError) => {
        setResponse(null);
        setError(error);
        setStatus(FetchStatus.FAILURE);
    }, []);

    const call = useCallback(async () => {
        setStatus(FetchStatus.LOADING);
        setError(null);

        try {
            const response = await fetch<T>(path, options);

            onSuccess(response);
        } catch (error) {
            onFailure(error);
        }
    }, [path, options, onSuccess, onFailure]);

    return { status, error, response, call };
}
