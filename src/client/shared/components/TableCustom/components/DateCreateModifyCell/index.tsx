import React, { FC } from 'react';

import { ChangeIDCard } from '@cwidgets/index';
import { IconCustom, Text, DropdownCustom } from '@ccomponents/index';
import { getDateFromUnixTS } from '@cshared/utils/getDateFromUnixTS';

import { AuditLog } from '@cshared/types/yasms';

import styles from './index.module.scss';

interface Props {
    create: AuditLog | undefined;
    modify: AuditLog | undefined;
}

const DateCreateModifyCell: FC<Props> = ({ create, modify }) => {
    const isExist = (date: AuditLog | undefined): boolean => {
        return Boolean(date && Number(date.ts) && date.ts > 0 && date.change_id && date.change_id.length > 0);
    };

    const createExist: AuditLog | false | undefined = isExist(create) && create;
    const modifyExist: AuditLog | false | undefined = isExist(modify) && modify;

    const createDate = createExist ? getDateFromUnixTS(createExist.ts) : '-';
    const modifyDate = modifyExist ? getDateFromUnixTS(modifyExist?.ts) : '-';

    const lastLog = modifyExist || createExist;
    const changeId = lastLog ? lastLog?.change_id : undefined;

    const getComponent = () => {
        if (createExist && !modifyExist) {
            return (
                <div className={styles.column_date__create}>
                    <Text typography="control-l" weight="regular" color={'control-link'}>
                        {createDate}
                    </Text>
                    <Text typography="control-l" weight="regular" color={'control-link'}>
                        <IconCustom className={styles.column_date__icon} type={'plus'} />
                    </Text>
                </div>
            );
        }

        return (
            <>
                <div className={styles.column_date__modify}>
                    <Text typography="control-m" weight="regular" color={'control-link'}>
                        {modifyExist && modifyDate}
                    </Text>
                    <Text typography="control-m" weight="regular" color={'control-link'}>
                        <IconCustom className={styles.column_date__icon} type={'pencil'} />
                    </Text>
                </div>
                <div className={styles.column_date__create}>
                    <Text typography="control-xxs" weight="regular" color={'control-secondary'}>
                        {createExist ? createDate : 'Not exist'}
                    </Text>
                    <Text typography="control-xxs" weight="regular" color={'control-secondary'}>
                        <IconCustom className={styles.column_date__icon} type={'plus'} />
                    </Text>
                </div>
            </>
        );
    };

    const canShow = createExist || modifyExist;

    return canShow ? (
        <div className={styles.column_date}>
            <div className={styles.column_date__inner}>
                <DropdownCustom
                    view="default"
                    trigger="hover"
                    scope={'inplace'}
                    content={<ChangeIDCard changeId={changeId} />}
                    style={{ borderRadius: '16px' }}
                >
                    <div className={styles.column_date__content}>{getComponent()}</div>
                </DropdownCustom>
            </div>
        </div>
    ) : null;
};

export { DateCreateModifyCell };
