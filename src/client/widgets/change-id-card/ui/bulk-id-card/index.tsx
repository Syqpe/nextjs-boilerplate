import React, { useState, useEffect, useMemo, FC, useCallback } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { ModalStore } from '@cwidgets/index';

import { Modal, Text, Button, Icon, IconCustom, Spin, TableCustom } from '@ccomponents/index';
import { getDateFromUnixTS } from '@cshared/utils/getDateFromUnixTS';
import { fetch } from 'src/client/shared/utils/fetch';
import { serverUrls } from 'src/shared/urls/server';
import { AuditBulksInfo, AuditBulkInfo, GetRequestInterface, isSuccess, AuditBulkInfoRow } from '@cshared/types/yasms';
import { Column } from 'react-table';

import styles from './index.module.scss';

interface Props {
    bulkId?: string;
}

const BulkIDCard: FC<Props> = ({ bulkId }) => {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState<AuditBulkInfo | null>(null);

    const fetchData = async (id?: string) => {
        const response = await fetch<GetRequestInterface<AuditBulksInfo>>(serverUrls.getBulkInfo, {
            params: {
                bulk_id: id,
            },
        });

        if (response && isSuccess(response)) {
            setLoading(false);

            const localInfo = response.data.audit_bulk_info;
            if (localInfo) {
                setInfo(localInfo);
            }
        }
    };

    useEffect(() => {
        fetchData(bulkId);
    }, []);

    const rows = useMemo<Array<AuditBulkInfoRow>>(() => {
        if (info) {
            return Object.entries(info.changes).map(item => {
                const [id, values] = item;
                return {
                    change_id: id,
                    ...values,
                };
            });
        }
        return [];
    }, [info]);

    const columns = useMemo<Array<Column<AuditBulkInfoRow>>>(
        () => [
            {
                Header: 'change_id',
                accessor: 'change_id',
                width: 80,
            },
            {
                Header: 'action',
                accessor: 'action',
                width: 90,
            },
            {
                Header: 'entity_id',
                accessor: 'entity_id',
                width: 90,
            },
            {
                Header: 'payload',
                accessor: 'payload',
                minWidth: 300,
                width: 800,
                maxWidth: 1000,
            },
        ],
        [],
    );

    const handleClose = useCallback(() => {
        dispatch(ModalStore.removeModal());
    }, []);

    return (
        <Modal theme="normal" visible hasAnimation keepMounted>
            <div className={styles.modal}>
                <div className={styles.modal__inner}>
                    {loading || !info ? (
                        <Spin progress position="center" view="default" size="l" />
                    ) : (
                        <>
                            <div className={styles.modal__header}>
                                <div className={styles.modal__title}>
                                    <Text typography="headline-m" weight="bold">
                                        Changes with bulk_id {info.id}
                                    </Text>
                                </div>
                                <div className={styles.modal__close}>
                                    <Button onClick={handleClose}>
                                        <Icon glyph={'type-cross-websearch'} />
                                    </Button>
                                </div>
                            </div>
                            <div className={styles.modal__info}>
                                <Text typography={'control-m'}>{info.author}</Text>
                                <Text typography={'control-m'} color={'secondary'}>
                                    {'\u00a0\u00a0'}•{'\u00a0\u00a0'}
                                    {getDateFromUnixTS(info.ts)}
                                    {'\u00a0\u00a0'}•{'\u00a0\u00a0'}
                                </Text>
                                <div className={styles.modal__info_icon}>
                                    <Text typography={'control-m'} color={'secondary'}>
                                        <IconCustom type={'treker'} />
                                    </Text>
                                </div>
                                <Text typography={'control-m'} color={'secondary'}>
                                    {info.issue ? info.issue : 'No task'}
                                </Text>
                            </div>
                            <div className={styles.modal__comment}>
                                <Text typography={'control-m'} color={info.comment ? 'primary' : 'secondary'}>
                                    {info.comment ? info.comment : 'No comment'}
                                </Text>
                            </div>
                            <div
                                className={`${styles.modal__table} ${
                                    styles[`modal__table_${rows.length > 2 ? 'l' : 'm'}`]
                                }`}
                            >
                                <TableCustom
                                    withoutCheckbox
                                    withoutLRBorders
                                    align="left"
                                    data={rows}
                                    columns={columns}
                                />
                            </div>
                            <div className={styles.modal__action}>
                                <Button view="default" onClick={handleClose}>
                                    <Text typography="control-xl" weight="medium">
                                        Close
                                    </Text>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export { BulkIDCard };
