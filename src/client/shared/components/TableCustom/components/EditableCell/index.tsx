import React, { useState, useEffect, useCallback, FC, SetStateAction, Dispatch } from 'react';
import { CellProps, IdType } from 'react-table';

import { Text } from '@ccomponents/index';
import { RowInterface, RowModeType, RowType } from '@cshared/types/tables';

import styles from './index.module.scss';

interface EditComponentProps<T, V> {
    value: V;
    setValue: Dispatch<SetStateAction<V>>;
    columnId: IdType<T>;
    handleSaveValue: (value: V) => void;
    isNew: boolean;
}

type EditableCellProps<T extends RowInterface, V = any> = CellProps<T, V> & {
    handleUpdateData: (index: number, id: IdType<T>, value: V) => void;
    EditComponent: FC<EditComponentProps<T, V>>;
};

const EditableCell = <T extends RowInterface, V = any>({
    value: initialValue,
    row,
    column,
    handleUpdateData,
    EditComponent,
}: EditableCellProps<T, V>) => {
    const [value, setValue] = useState(initialValue);
    const { id } = column;
    const { index } = row;

    const rowData = row.original;
    const editing = rowData?.rowMode === RowModeType.UPDATE;
    const isNew = rowData?.rowType === RowType.NEW;

    const handleSaveValue = useCallback(
        (value: V) => {
            handleUpdateData(index, id, value);
        },
        [index, id],
    );

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return editing && EditComponent ? (
        <EditComponent
            value={value}
            setValue={setValue}
            columnId={id}
            handleSaveValue={handleSaveValue}
            isNew={isNew}
        />
    ) : (
        <div className={styles.default}>
            <Text weight="regular">{value}</Text>
        </div>
    );
};

export type { EditComponentProps };
export { EditableCell };
