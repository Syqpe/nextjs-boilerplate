import { AxiosRequestConfig } from 'axios';

import { config as defaultConfig } from './defaults';

interface ServicesInterface {
    dao: AxiosRequestConfig;
}

interface ApiInterface {
    yasmsInternal: ServicesInterface;
}

export const api: ApiInterface = {
    yasmsInternal: {
        dao: {
            baseURL: 'http://yasms-admtest-internal.passport.yandex.net',
        },
    },
};

export const retries = {
    timeout: 1,
    error: 1,
};

export { defaultConfig };
