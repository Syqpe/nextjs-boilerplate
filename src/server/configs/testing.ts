import { AxiosRequestConfig } from 'axios';

interface ServicesInterface {
    dao: AxiosRequestConfig;
}

interface ApiInterface {
    yasmsInternal: ServicesInterface;
}

export const api: ApiInterface = {
    yasmsInternal: {
        dao: {
            baseURL: 'http://127.0.0.1:8201',
        },
    },
};

export const retries = {
    timeout: 1,
    error: 1,
};
