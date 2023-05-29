import React, { useEffect, FC } from 'react';
import { useRouter } from 'next/router';
import { FetchParams, useRequest } from '@cshared/hooks/use-request';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { setRoutes } from '@client/app/store/reducers/routesSlice';

import { SearchConstructor } from '@cfeatures/index';
import { serverUrls } from 'src/shared/urls/server';
import { parseQuery } from '@cshared/utils/codeQuery';

import { AxiosRequestConfig } from 'axios';
import { isSuccess, Route } from '@cshared/types/yasms';
import { filterMap } from '../../lib/filterMap';

import styles from './index.module.scss';

export interface GetRoutesInterface {
    routes?: Array<Route>;
}

const Table: FC = () => {
    const dispatch = useAppDispatch();
    const { query } = useRouter();

    const fetchParams: FetchParams = {
        path: serverUrls.getSome,
        options: {
            params: {
                limit: 30,
                min: 0,
                filter: parseQuery(query.filterOptions),
            },
        },
    };
    if (!fetchParams.options?.params.filter) {
        delete fetchParams.options?.params.filter;
    }
    const { queryRequest } = useRequest<GetRoutesInterface>(fetchParams);
    const fetchData = async (customOption?: AxiosRequestConfig | undefined) => {
        const response = await queryRequest(customOption);
        if (response && isSuccess(response)) {
            dispatch(setRoutes(response.data?.routes || []));
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={styles.table}>
            <div className={styles.table__inner}>
                <div className={styles.table__search}>
                    <SearchConstructor map={filterMap} fetchParams={fetchParams} fetchData={fetchData} />
                </div>
            </div>
        </div>
    );
};

export { Table };
