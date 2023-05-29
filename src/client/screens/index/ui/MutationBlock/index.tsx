import React, { useCallback, FC } from 'react';
import { useAppDispatch, useAppSelector } from '@client/shared/hooks/store-hooks';
import { selectItems } from '@client/app/store/reducers/routesSlice';
import { selectUser } from '@client/app/store/reducers/userSlice';

import { ModalStore, ModalDelete } from '@cwidgets/index';
import { Button, Text } from '@ccomponents/index';
import { serverUrls } from 'src/shared/urls/server';

import { RouteRowInterface } from '@cshared/types/tables';
import { AccessType, hasAccess } from '@cshared/utils/hasAccess';
import { AccessEnums } from '@cshared/types/yasms';
import { AxiosRequestConfig } from 'axios';
import { FetchParams } from '@cshared/hooks/use-request';
import { ModalMutation } from '../ModalMutation';

interface Props {
    className?: string;
    selectedRows: Array<string>;

    fetchData: (customOption?: AxiosRequestConfig | undefined) => Promise<void>;
    fetchParams: FetchParams;
}

const MutationBlock: FC<Props> = ({ className = '', selectedRows, fetchData, fetchParams }) => {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUser);
    const rows: Array<RouteRowInterface> = useAppSelector(selectItems);

    const handleOpenModal = useCallback(
        (type?: 'add' | 'edit') => {
            if (type) {
                dispatch(
                    ModalStore.addModal(
                        <ModalMutation
                            type={type}
                            rows={rows}
                            selectedRows={selectedRows}
                            fetchData={fetchData}
                            fetchParams={fetchParams}
                        />,
                    ),
                );

                return;
            }

            dispatch(
                ModalStore.addModal(
                    <ModalDelete
                        keyId="ruleId"
                        url={serverUrls.putRoutes}
                        rows={rows}
                        selectedRows={selectedRows}
                        fetchData={fetchData}
                        fetchParams={fetchParams}
                    />,
                ),
            );
        },
        [serverUrls, rows, selectedRows, fetchData, fetchParams],
    );

    return hasAccess(userData, AccessEnums.routes, AccessType.WRITE) ? (
        <div className={className}>
            <Button view="action" disabled={!selectedRows.length} onClick={() => handleOpenModal()}>
                <Text weight="medium">delete</Text>
            </Button>
            <Button view="action" onClick={() => handleOpenModal('add')}>
                <Text weight="medium">add</Text>
            </Button>
            <Button view="action" disabled={!selectedRows.length} onClick={() => handleOpenModal('edit')}>
                <Text weight="medium">edit</Text>
            </Button>
        </div>
    ) : null;
};

export { MutationBlock };
