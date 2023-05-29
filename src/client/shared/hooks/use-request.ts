import { AxiosRequestConfig } from 'axios';
import { useState, useCallback } from 'react';

import { FetchStatus } from 'src/client/shared/types/fetch-status';
import { APIError } from 'src/client/shared/utils/api-error';
import { fetch } from 'src/client/shared/utils/fetch';
import { GetRequestInterface, isSuccess, isSuccessMutation, MutationRequestInterface } from '@cshared/types/yasms';
import { parseQuery } from '@cshared/utils/codeQuery';

interface OptionsProps {
    limit?: string;
    min?: string;
    filter?: string;
}

interface FetchParams {
    path: string;
    options?: AxiosRequestConfig;
    nextOptions?: Array<OptionsProps>;
}

interface FetchResult<T> {
    nextOptions: Array<OptionsProps>;
    status: FetchStatus | null;
    error: APIError | null;

    queryRequest: (customOption?: AxiosRequestConfig | undefined) => Promise<T | undefined>;
    queryRequestNext: (all?: boolean) => Promise<T | undefined>;

    mutation: (putPath: string, options: AxiosRequestConfig) => Promise<MutationRequestInterface | undefined>;
}

const next2Obj = (next: string | OptionsProps): OptionsProps | undefined => {
    let nextOption: OptionsProps | undefined = undefined;
    if (typeof next === 'object' && next !== null) {
        nextOption = next;
    } else if (next && next.length > 0) {
        nextOption = next
            .slice(next.indexOf('?') + 1)
            .split('&')
            .reduce((obj, item) => {
                const [key, value] = item.split('=');
                obj[key] = key === 'filter' ? parseQuery(value) : Number(value);
                return obj;
            }, {});
    }
    return nextOption;
};

function useRequest<T>(params: FetchParams): FetchResult<GetRequestInterface<T>> {
    const { path, options, nextOptions: propNextOptions } = params;
    const [nextOptions, setNextOptions] = useState<Array<OptionsProps>>(propNextOptions || []);

    const [status, setStatus] = useState<FetchStatus | null>(null);
    const [error, setError] = useState<APIError | null>(null);

    const onSuccess = useCallback(() => {
        setError(null);
        setStatus(FetchStatus.SUCCESS);
    }, []);

    const onFailure = useCallback((error: APIError) => {
        setError(error);
        setStatus(FetchStatus.FAILURE);
    }, []);

    const cacheNextRequest = useCallback(
        (next: string | OptionsProps) => {
            const nextOption = next2Obj(next);
            if (nextOption) {
                setNextOptions(nextOptions.concat([nextOption]));
            }
        },
        [nextOptions],
    );

    const queryRequest = useCallback(
        async (customOption?: AxiosRequestConfig) => {
            setStatus(FetchStatus.LOADING);
            setError(null);
            setNextOptions([]);

            let response = undefined;
            try {
                response = await fetch<GetRequestInterface<T>>(path, customOption || options);
                if (isSuccess(response)) {
                    cacheNextRequest(response.data.next || '');
                    onSuccess();
                } else {
                    throw new APIError({
                        code: String(response.status),
                        status: response.status,
                        statusText: response.statusText,
                        message: response.message,
                    });
                }
            } catch (error) {
                onFailure(error as APIError);
            } finally {
                return response;
            }
        },
        [path, cacheNextRequest, onSuccess, onFailure],
    );

    const queryRequestNext = useCallback(
        async (all?: boolean) => {
            setStatus(FetchStatus.LOADING);
            setError(null);

            if (nextOptions.length > 0) {
                let response = undefined;
                try {
                    const nextOption = nextOptions.pop();
                    if (all && nextOption?.limit) {
                        nextOption.limit = '100000000000';
                    }

                    response = await fetch<GetRequestInterface<T>>(path, { params: nextOption });

                    if (isSuccess(response)) {
                        cacheNextRequest(response.data.next || '');
                        onSuccess();

                        if (all) {
                            setNextOptions([]);
                        }
                    } else {
                        throw new APIError({
                            code: String(response.status),
                            status: response.status,
                            statusText: response.statusText,
                            message: response.message,
                        });
                    }
                } catch (error) {
                    onFailure(error as APIError);
                } finally {
                    return response;
                }
            }

            setStatus(FetchStatus.SUCCESS);
            return undefined;
        },
        [path, nextOptions, cacheNextRequest, onSuccess, onFailure],
    );

    const mutation = useCallback(
        async (currPath: string, options: AxiosRequestConfig) => {
            setStatus(FetchStatus.LOADING);
            setError(null);

            let response = undefined;
            try {
                response = await fetch<MutationRequestInterface>(currPath, options);
                if (response && isSuccessMutation(response)) {
                    onSuccess();
                } else {
                    throw new APIError({
                        code: String(response.status),
                        status: response.status,
                        statusText: response.statusText,
                        message: response.message,
                    });
                }
            } catch (error) {
                onFailure(error as APIError);
            } finally {
                return response;
            }
        },
        [onSuccess, onFailure],
    );

    return {
        nextOptions,
        status,
        error,
        queryRequest,
        queryRequestNext,
        mutation,
    };
}
export type { FetchParams };
export { useRequest };
