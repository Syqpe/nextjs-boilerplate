import React, { useEffect, useState, useCallback, FC } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { ModalStore } from '@cwidgets/index';

import { IconCustom, Text, Button, Spin } from '@ccomponents/index';
import { Divider } from '@yandex-lego/components/Divider';
import { fetch } from 'src/client/shared/utils/fetch';
import { serverUrls } from 'src/shared/urls/server';
import { getDateFromUnixTS } from '@cshared/utils/getDateFromUnixTS';
import { AuditChangesInfo, AuditChangeInfo, GetRequestInterface, isSuccess } from '@cshared/types/yasms';
import { BulkIDCard } from '../bulk-id-card';

import styles from './index.module.scss';

interface Props {
    changeId?: string;
}

const ChangeIDCard: FC<Props> = ({ changeId }) => {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(true);
    const [info, setInfo] = useState<AuditChangeInfo | null>(null);

    const fetchData = async (id?: string) => {
        const response = await fetch<GetRequestInterface<AuditChangesInfo>>(serverUrls.getChangeInfo, {
            params: {
                change_id: id,
            },
        });

        if (response && isSuccess(response)) {
            setLoading(false);

            const localInfo = response.data.audit_changes_info[id || ''];
            if (localInfo) {
                setInfo(localInfo);
            }
        }
    };

    useEffect(() => {
        fetchData(changeId);
    }, []);

    const handleClick = useCallback(() => {
        dispatch(ModalStore.addModal(<BulkIDCard bulkId={info?.bulk_info.id} />));
    }, [info]);

    return (
        <div className={styles.change_id_card}>
            <div className={styles.change_id_card__inner}>
                {loading || !info ? (
                    <Spin progress position="center" view="default" size="l" />
                ) : (
                    <>
                        <div className={styles.change_id_card__header}>
                            <Button onClick={handleClick}>
                                <Text typography={'control-m'}>
                                    bulk_id {info.bulk_info.id}
                                    {'\u00a0\u00a0'}•{'\u00a0\u00a0'}change_id {changeId}
                                </Text>
                            </Button>
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div className={styles.change_id_card__comment}>
                            <Text typography={'control-m'} color={info.bulk_info.comment ? 'primary' : 'secondary'}>
                                {info.bulk_info.comment ? info.bulk_info.comment : 'No comment'}
                            </Text>
                        </div>
                        <div className={styles.change_id_card__info}>
                            <Text typography={'control-m'}>
                                {info.bulk_info.author}
                                <Text typography={'control-m'} color={'secondary'}>
                                    {'\u00a0\u00a0'}•{'\u00a0\u00a0'}
                                    {getDateFromUnixTS(info.bulk_info.ts)}
                                </Text>
                            </Text>
                        </div>
                        <div className={styles.change_id_card__task}>
                            <div className={styles.change_id_card__task_icon}>
                                <Text typography={'control-m'} color={'secondary'}>
                                    <IconCustom type={'treker'} />
                                </Text>
                            </div>
                            <Text typography={'control-m'} color={'secondary'}>
                                {info.bulk_info.issue ? info.bulk_info.issue : 'No task'}
                            </Text>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export { ChangeIDCard };
