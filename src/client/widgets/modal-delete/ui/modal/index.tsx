import React, { useCallback } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { useRequest, FetchParams } from '@cshared/hooks/use-request';
import { ToastStore, ModalStore } from '@cwidgets/index';

import { DisplayObj } from '@centities/index';
import { serverUrls } from 'src/shared/urls/server';
import { Button, Text, Modal, Icon } from '@ccomponents/index';

import { RowInterface } from '@cshared/types/tables';
import { AxiosRequestConfig } from 'axios';
import { isSuccessMutation } from '@cshared/types/yasms';
import { FetchStatus } from '@cshared/types/fetch-status';

import styles from './index.module.scss';

type Props<T extends RowInterface> = {
    keyId: string;
    url: typeof serverUrls[keyof typeof serverUrls];

    rows: Array<T>;
    selectedRows: Array<string>;

    fetchData: (customOption?: AxiosRequestConfig | undefined) => Promise<void>;
    fetchParams: FetchParams;
};

function ModalDelete<T extends RowInterface>({ keyId, url, rows, selectedRows, fetchData, fetchParams }: Props<T>) {
    const dispatch = useAppDispatch();

    const rowsChecked = rows.filter(item => selectedRows.includes(item.rowId)).filter(item => Boolean(item[keyId]));
    const { status, error, mutation } = useRequest<unknown>({
        path: '',
    });

    const handleCancel = useCallback(() => {
        dispatch(ModalStore.removeModal());
    }, []);

    const handleSubmit = useCallback(
        async function () {
            const options: AxiosRequestConfig = {
                method: 'PUT',
                data: {
                    delete: rowsChecked.map(item => item[keyId]),
                },
            };

            const response = await mutation(url, options);
            if (response && isSuccessMutation(response)) {
                handleCancel();
                dispatch(
                    ToastStore.notify({
                        message: `You have deleted ${selectedRows.length} rows`,
                        options: {
                            type: ToastStore.MessageType.SUCCESS,
                            duration: 3000,
                            position: ToastStore.MessagePositions['RIGHT-TOP'],
                        },
                    }),
                );
                fetchData(fetchParams.options);
            }
        },
        [rowsChecked, keyId, fetchParams],
    );

    return (
        <Modal theme="normal" visible hasAnimation>
            <div className={styles.modal}>
                <div className={styles.modal__inner}>
                    <div className={styles.modal__header}>
                        <div className={styles.modal__title}>
                            <Text typography="headline-l" weight="bold">
                                Are you sure you want to delete {selectedRows.length} rows?
                            </Text>
                        </div>
                        <div className={styles.modal__close}>
                            <Button onClick={handleCancel}>
                                <Icon glyph={'type-cross-websearch'} />
                            </Button>
                        </div>
                    </div>
                    <DisplayObj className={error ? styles.modal__feedback : ''} value={error} />
                    <div className={styles.modal__action}>
                        <div className={styles.modal__cancel}>
                            <Button view="default" onClick={handleCancel}>
                                <Text typography="control-xl" weight="medium">
                                    Cancel
                                </Text>
                            </Button>
                        </div>
                        <div className={styles.modal__submit}>
                            <Button
                                view="action"
                                disabled={Boolean(status) && status === FetchStatus.LOADING}
                                onClick={handleSubmit}
                            >
                                <Text typography="control-xl" weight="medium">
                                    Delete
                                </Text>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export { ModalDelete };
