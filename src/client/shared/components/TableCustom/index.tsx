/* eslint-disable react/jsx-key */
import React, { useEffect, useCallback, useMemo } from 'react';
import { useTable, useBlockLayout, useRowSelect, TableOptions, Column, CellProps } from 'react-table';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Text, Spin, Button, Tooltip } from '@ccomponents/index';
import { RowInterface } from '@cshared/types/tables';
import { FetchStatus } from '@cshared/types/fetch-status';
import {
    EditableCell,
    EditComponentProps,
    IndeterminateCheckbox,
    SaveEditActionCell,
    DateCreateModifyCell,
    InputHeader,
    ComboBoxHeader,
} from './components';

import styles from './index.module.scss';

type TableProps<T extends RowInterface | Object> = TableOptions<T> & {
    [key: string]: any | boolean;
    withoutCheckbox?: boolean;
    fullWidth?: boolean;
    headerHeightM?: boolean;
    withoutLRBorders?: boolean;
    align?: 'left' | 'right';
};

function TableCustom<T extends RowInterface | Object, V = any>({
    status,
    data,
    columns,
    withoutCheckbox,
    fullWidth,
    handleUpdateData,
    handleSelectRows,
    EditComponent,
    headerHeightM,
    withoutLRBorders,
    align,
}: TableProps<T>) {
    const defaultColumn = useMemo<Partial<Column<T>>>(
        () => ({
            width: fullWidth ? 1000 : 140,
            Cell: EditableCell,
        }),
        [],
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state: { selectedRowIds },
    } = useTable<T>(
        {
            columns,
            data,
            defaultColumn,
            handleUpdateData,
            EditComponent,
        },
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => {
                if (withoutCheckbox) {
                    return columns;
                }
                return [
                    {
                        width: 22,
                        id: 'checkbox',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({ row }: CellProps<T, V>) => (
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        ),
                    },
                    ...columns,
                ];
            });
        },
        useBlockLayout,
    );

    useEffect(() => {
        if (selectedFlatRows && handleSelectRows) handleSelectRows(selectedFlatRows.map(item => item.original));
    }, [selectedFlatRows]);

    const RenderRow = useCallback(
        ({ index, style }) => {
            const row = rows[index];
            if (!row) {
                return <div className="tr" />;
            }
            prepareRow(row);

            return (
                <div
                    className="tr"
                    {...row.getRowProps({
                        style,
                    })}
                >
                    {row.cells.map(cell => {
                        return (
                            <div className="td" {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </div>
                        );
                    })}
                </div>
            );
        },
        [prepareRow, rows, selectedFlatRows, selectedRowIds],
    );

    const width: string = String(headerGroups[0].getHeaderGroupProps().style?.width);

    if (Boolean(status) && FetchStatus.LOADING === status) {
        return <Spin progress position="center" view="default" size="l" />;
    }

    return (
        <div className={styles.table_wrapper}>
            <table className={styles.table_wrapper__inner} {...getTableProps()}>
                <AutoSizer>
                    {({ height, width: sizerWidth }) => (
                        <>
                            <thead
                                className={`${headerHeightM ? styles.headerHeightM : ''} ${
                                    withoutLRBorders ? styles.withoutLRBorders : ''
                                } ${align ? styles[align] : ''}`}
                                style={fullWidth ? { width: sizerWidth } : { width }}
                            >
                                {headerGroups.map(headerGroup => {
                                    return (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => {
                                                return (
                                                    <th {...column.getHeaderProps()}>
                                                        <Text
                                                            weight="regular"
                                                            style={{ width: '100%', height: '100%' }}
                                                        >
                                                            {column.render('Header')}
                                                        </Text>
                                                        {column.tooltip && (
                                                            <Tooltip
                                                                view="default"
                                                                size="m"
                                                                hasTail
                                                                content={column.tooltip}
                                                                trigger="hover"
                                                                closeDelay={500}
                                                            >
                                                                <Button className={styles.table_wrapper__hover_element}>
                                                                    <svg
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            clipRule="evenodd"
                                                                            d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM5.178 6.096C5.178 4.44 6.546 3.432 8.274 3.432C9.978 3.432 11.25 4.44 11.25 5.928V5.976C11.25 7.392 10.338 7.968 9.486 8.34L9.27 8.436C8.982 8.568 8.886 8.724 8.886 9.072C8.886 9.24431 8.74631 9.384 8.574 9.384H7.734C7.49541 9.384 7.302 9.19059 7.302 8.952C7.302 8.136 7.59 7.62 8.346 7.284L8.562 7.188C9.282 6.864 9.666 6.6 9.666 6C9.666 5.352 9.114 4.92 8.274 4.92C7.41 4.92 6.762 5.352 6.762 6.168C6.762 6.32706 6.63306 6.456 6.474 6.456H5.538C5.33918 6.456 5.178 6.29482 5.178 6.096ZM8.094 9.888C7.446 9.888 6.954 10.356 6.954 11.028C6.954 11.7 7.446 12.168 8.094 12.168C8.742 12.168 9.234 11.7 9.234 11.028C9.234 10.356 8.742 9.888 8.094 9.888Z"
                                                                            fill="#85889E"
                                                                        />
                                                                    </svg>
                                                                </Button>
                                                            </Tooltip>
                                                        )}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                <VariableSizeList
                                    width={fullWidth ? sizerWidth : width}
                                    height={height}
                                    itemSize={() => 58}
                                    itemCount={rows.length + (headerHeightM ? 2 : 1)}
                                >
                                    {RenderRow}
                                </VariableSizeList>
                            </tbody>
                        </>
                    )}
                </AutoSizer>
            </table>
        </div>
    );
}

export type { EditComponentProps };
export { TableCustom, SaveEditActionCell, DateCreateModifyCell, InputHeader, ComboBoxHeader };
