import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';
import { useRouter } from 'next/router';
import { FetchParams, useRequest } from '@cshared/hooks/use-request';
import { useAppSelector, useAppDispatch } from '@client/shared/hooks/store-hooks';
import { setLoading, handleEdit, selectItems, setRouteRows, setRoutes } from '@client/app/store/reducers/routesSlice';
import { selectUser } from '@client/app/store/reducers/userSlice';

import { MoreRowBlock } from '@cwidgets/index';
import { DisplayObj } from '@centities/index';
import { SearchConstructor } from '@cfeatures/index';
import { TableCustom } from '@ccomponents/index';
import { serverUrls } from 'src/shared/urls/server';
import { parseQuery } from '@cshared/utils/codeQuery';
import { SaveEditActionCell, DateCreateModifyCell } from '@ccomponents/TableCustom';

import { AccessType, hasAccess } from '@cshared/utils/hasAccess';
import { AxiosRequestConfig } from 'axios';
import { CellProps, Column } from 'react-table';
import { RouteRowInterface } from '@cshared/types/tables';
import { AccessEnums, ChangeInfoInterface, isSuccess, isSuccessMutation, Route } from '@cshared/types/yasms';
import { MutationBlock } from '../MutationBlock';
import { filterMap } from '../../lib/filterMap';
import { EditComponent } from './EditComponent';

import styles from './index.module.scss';

export interface GetRoutesInterface {
    routes?: Array<Route>;
}

const Table: FC = () => {
    const dispatch = useAppDispatch();
    const { query } = useRouter();

    const userData = useAppSelector(selectUser);
    const rows: Array<RouteRowInterface> = useAppSelector(selectItems);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const fetchParams: FetchParams = {
        path: serverUrls.getRoutes,
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
    const { status, error, queryRequest, queryRequestNext, mutation } = useRequest<GetRoutesInterface>(fetchParams);
    const fetchData = async (customOption?: AxiosRequestConfig | undefined) => {
        const response = await queryRequest(customOption);
        if (response && isSuccess(response)) {
            dispatch(setRoutes(response.data?.routes || []));
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = useCallback(
        async function (
            rowId: string,
            body: {
                change_info: ChangeInfoInterface;
            },
        ) {
            dispatch(setLoading(true));
            const item = rows.find(item => item?.rowId === rowId);
            const saveItem = {
                rule_id: item?.ruleId,
                destination: item?.destination,
                gates: [item?.gateId1, item?.gateId2, item?.gateId3].filter(Boolean),
                mode: item?.mode,
                weight: Number(item?.weight),
            };
            const options: AxiosRequestConfig = {
                method: 'PUT',
                data: {
                    update: [saveItem],
                    ...body,
                },
            };

            try {
                const response = await mutation(serverUrls.putRoutes, options);
                if (response && isSuccessMutation(response)) {
                    fetchData(fetchParams.options);
                }
            } finally {
                dispatch(setLoading(false));
            }
        },
        [rows],
    );

    const handleUpdateData = useCallback(
        (rowIndex: number, columnId: string, value: any) => {
            dispatch(
                setRouteRows(
                    rows.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...row,
                                [columnId]: value,
                            };
                        }
                        return row;
                    }),
                ),
            );
        },
        [rows],
    );

    useEffect(() => {
        dispatch(setLoading(false));
    }, [rows]);

    const columns = useMemo<Column<RouteRowInterface>[]>(() => {
        const arr: Column<RouteRowInterface>[] = [
            {
                Header: 'rule_id',
                accessor: 'ruleId',
                tooltip: 'rule_id',
            },
            {
                Header: 'date',
                tooltip: 'date',
                Cell: ({ row }: CellProps<RouteRowInterface>) => {
                    return <DateCreateModifyCell create={row.original.auditCreate} modify={row.original.auditModify} />;
                },
            },
            {
                Header: 'destination',
                accessor: 'destination',
                tooltip: 'destination',
            },

            {
                Header: 'gateid',
                accessor: 'gateId1',
                tooltip: 'gateid',
            },
            {
                Header: 'gateId2',
                accessor: 'gateId2',
                tooltip: 'gateId2',
            },
            {
                Header: 'gateId3',
                accessor: 'gateId3',
                tooltip: 'gateId3',
            },

            {
                Header: 'mode',
                accessor: 'mode',
                tooltip: 'mode',
            },
            {
                Header: 'weight',
                accessor: 'weight',
                tooltip: 'weight',
            },
            {
                Header: 'region',
                accessor: 'region',
                tooltip: 'region',
            },

            {
                Header: 'Consumer',
                accessor: 'gateId1Consumer',
                tooltip: 'Consumer',
            },
            {
                Header: 'Fromname',
                accessor: 'gateId1Fromname',
                tooltip: 'Fromname',
            },
            {
                Header: 'Aliase',
                accessor: 'gateId1Aliase',
                tooltip: 'Aliase',
            },
            {
                Header: 'Protocol',
                accessor: 'gateId1Protocol',
                tooltip: 'Protocol',
            },

            {
                Header: 'Consumer2',
                accessor: 'gateId2Consumer',
                tooltip: 'Consumer2',
            },
            {
                Header: 'Fromname2',
                accessor: 'gateId2Fromname',
                tooltip: 'Fromname2',
            },
            {
                Header: 'Aliase2',
                accessor: 'gateId2Aliase',
                tooltip: 'Aliase2',
            },
            {
                Header: 'Protocol2',
                accessor: 'gateId2Protocol',
                tooltip: 'Protocol2',
            },

            {
                Header: 'Consumer3',
                accessor: 'gateId3Consumer',
                tooltip: 'Consumer3',
            },
            {
                Header: 'Fromname3',
                accessor: 'gateId3Fromname',
                tooltip: 'Fromname3',
            },
            {
                Header: 'Aliase3',
                accessor: 'gateId3Aliase',
                tooltip: 'Aliase3',
            },
            {
                Header: 'Protocol3',
                accessor: 'gateId3Protocol',
                tooltip: 'Protocol3',
            },

            {
                Header: 'Edit/Save',
                width: 200,
                Cell: ({ row, column }: CellProps<RouteRowInterface>) => {
                    return (
                        <SaveEditActionCell
                            status={status}
                            row={row}
                            column={column}
                            handleUpdateData={handleUpdateData}
                            handleSubmit={handleSubmit}
                            handleEdit={handleEdit}
                        />
                    );
                },
            },
        ];

        if (!hasAccess(userData, AccessEnums.routes, AccessType.WRITE)) {
            arr.pop();
        }
        return arr;
    }, [status, userData, rows]);

    return (
        <div className={styles.table}>
            <div className={styles.table__inner}>
                <div className={styles.table__search}>
                    <SearchConstructor map={filterMap} fetchParams={fetchParams} fetchData={fetchData} />
                </div>
                <div className={styles.table__content}>
                    <TableCustom
                        withoutCheckbox={!hasAccess(userData, AccessEnums.routes, AccessType.WRITE)}
                        status={status}
                        data={rows}
                        columns={columns}
                        handleUpdateData={handleUpdateData}
                        handleSelectRows={(selectedOriginRows: Array<RouteRowInterface>) => {
                            setSelectedRows(selectedOriginRows.map(item => String(item.rowId)));
                        }}
                        EditComponent={EditComponent}
                    />
                </div>

                <DisplayObj className={error ? styles.table__feedback : ''} value={error} />

                <MoreRowBlock className={styles.table__gets} type={'routes'} queryRequestNext={queryRequestNext} />

                <MutationBlock
                    className={styles.table__mutation}
                    selectedRows={selectedRows}
                    fetchData={fetchData}
                    fetchParams={fetchParams}
                />
            </div>
        </div>
    );
};

export { Table };
