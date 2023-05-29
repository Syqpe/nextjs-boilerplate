import React, { useState, useCallback, memo, FC } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { Button, Input } from '@ccomponents/index';

import { RowInterface, RowType } from '@cshared/types/tables';
import { FetchStatus } from '@cshared/types/fetch-status';
import { ChangeInfoInterface } from '@cshared/types/yasms';

import { Row, ColumnInstance } from 'react-table';

import styles from './index.module.scss';

interface Props<T extends RowInterface> {
    loading?: boolean;
    status?: FetchStatus | null;

    row: Row<T>;
    column: ColumnInstance<T>;

    handleUpdateData: (rowIndex: number, columnId: string, value: any) => void;
    handleSubmit: (
        rowId: string,
        body: {
            change_info: ChangeInfoInterface;
        },
    ) => Promise<void>;
    handleEdit: ActionCreatorWithPayload<string, string>;
}

const SaveEditActionCell: FC<Props<RowInterface>> = memo(
    ({ loading, status, row, column, handleUpdateData, handleSubmit, handleEdit }) => {
        const maxLength = 128;

        const { id } = column;
        const { index, original } = row;

        const type = original.rowType;
        const rowId = original.rowId;

        const dispatch = useAppDispatch();

        const [info, setInfo] = useState<ChangeInfoInterface>({
            issue: [''],
            comment: '',
            ...original.change_info,
        });
        const [error, setError] = useState<string | undefined>(undefined);

        const handleSaveValue = useCallback(() => {
            handleUpdateData(index, 'change_info', info);
        }, [index, id, info]);

        const handleChange = useCallback(
            (key: string, value: string) => {
                let localInfo: ChangeInfoInterface = { ...info };

                if (key === 'issue') {
                    const localValue = value.toUpperCase();

                    isValid(localValue);

                    localInfo[key] = [localValue];
                } else {
                    localInfo[key] = value;
                }

                setInfo(localInfo);
            },
            [info],
        );

        const isValid = useCallback((value: string) => {
            const reg = /[A-Za-z]{1,10}-[0-9]{1,10}/gm;
            if (reg.test(value)) {
                setError(undefined);
            } else {
                setError('Not valid task');
            }
        }, []);

        const handleSubmitClick = useCallback(() => {
            handleSubmit(rowId, { change_info: info });
        }, [rowId, info]);

        const handleEditClick = useCallback(() => {
            dispatch(handleEdit(rowId));
        }, [rowId]);

        const isSaveMode = type === RowType.UPDATED || type === RowType.NEW;
        const saveButtonDisabled =
            loading ||
            (Boolean(status) && status === FetchStatus.LOADING) ||
            !info?.issue?.[0].length ||
            Boolean(error?.length);
        const editButtonDisabled = loading || (Boolean(status) && status === FetchStatus.LOADING);

        return isSaveMode ? (
            <div className={styles.column_action}>
                <div className={styles.column_action__inner}>
                    <div className={styles.column_action__input}>
                        <Input
                            state={error?.length ? 'error' : undefined}
                            size="m"
                            view="default"
                            placeholder="E.g.: YASMS-123"
                            value={info?.issue?.[0]}
                            onChange={event => handleChange('issue', event.target.value)}
                            onBlur={handleSaveValue}
                            maxLength={maxLength}
                        />
                    </div>
                    <div className={styles.column_action__save}>
                        <Button
                            className={styles.column_action__btn}
                            view="action"
                            disabled={saveButtonDisabled}
                            onClick={handleSubmitClick}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        ) : (
            <Button
                className={styles.column_action__btn}
                view="default"
                disabled={editButtonDisabled}
                onClick={handleEditClick}
            >
                Edit
            </Button>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.column.id === nextProps.column.id;
    },
);

export { SaveEditActionCell };
