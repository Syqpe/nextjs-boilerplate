import React, { useState, useCallback, useMemo } from 'react';
import { useRequest, FetchParams } from '@cshared/hooks/use-request';
import { selectItems as selectGates } from '@client/app/store/reducers/gatesSlice';
import { selectItems as selectRegions } from '@client/app/store/reducers/regionsSlice';
import { ToastStore, ModalStore } from '@cwidgets/index';
import { useAppDispatch, useAppSelector } from '@client/shared/hooks/store-hooks';

import { DisplayObj, ChangeInfo } from '@centities/index';
import { serverUrls } from 'src/shared/urls/server';
import { TableCustom, Button, Text, Icon, Modal } from '@ccomponents/index';
import { getOneFromDuplicate } from '@cshared/utils/getOneFromDuplicate';
import { getHashString } from '@cshared/utils/getHashString';
import { InputHeader, ComboBoxHeader } from '@ccomponents/TableCustom';

import { AxiosRequestConfig } from 'axios';
import { IItem } from '@client/shared/components/ComboBox/ComboBox';
import { ChangeInfoInterface, isSuccessMutation } from '@cshared/types/yasms';
import { Column } from 'react-table';
import { GateRowInterface, RegionRowInterface, RouteRowInterface, RowModeType, RowType } from '@cshared/types/tables';
import { FetchStatus } from '@cshared/types/fetch-status';
import { EditComponent } from '../Table/EditComponent';

import styles from './index.module.scss';

const getGateContent = (item: GateRowInterface) => {
    return `${item.fromname || '-'} • ${item.consumer || '-'} • ${item.aliase || '-'} • ${item.protocol || '-'}`;
};

type Props<T extends RouteRowInterface> = {
    type: 'add' | 'edit';

    rows: Array<T>;
    selectedRows: Array<string>;

    fetchData: (customOption?: AxiosRequestConfig | undefined) => Promise<void>;
    fetchParams: FetchParams;
};

function ModalMutation<T extends RouteRowInterface>({ type, rows, selectedRows, fetchData, fetchParams }: Props<T>) {
    const dispatch = useAppDispatch();

    // ADDITIONAL DATA
    let gateRows: Array<GateRowInterface> = useAppSelector(selectGates);
    let regionRows: Array<RegionRowInterface> = useAppSelector(selectRegions);

    // EDIT
    const [rowsChecked, setRowsChecked] = useState<Array<RouteRowInterface>>(
        rows.filter(item => selectedRows.includes(item.rowId)).filter(item => Boolean(item.ruleId)),
    );

    // ADD
    const [selfSelectedRows, setSelfSelectedRows] = useState<string[]>([]);
    const [newRows, setNewRows] = useState<Array<RouteRowInterface>>([
        {
            rowType: RowType.NEW,
            rowMode: RowModeType.UPDATE,
            rowId: getHashString(),
        },
    ]);

    const [weight, setWeight] = useState<string>('');
    const [mode, setMode] = useState<string>('');
    const [region, setRegion] = useState<string>('');
    const [gateId1, setGateId1] = useState<string>('');
    const [gateId2, setGateId2] = useState<string>('');
    const [gateId3, setGateId3] = useState<string>('');

    const [focWeight, setFocWeight] = useState<boolean>(false);
    const [focMode, setFocMode] = useState<boolean>(false);

    const [changeInfo, setChangeInfo] = useState<ChangeInfoInterface>({
        issue: [''],
        comment: '',
    });
    const [changeInfoError, setChangeInfoError] = useState<string | undefined>(undefined);

    const { status, error, mutation } = useRequest<any>({
        path: '',
    });

    const isTypeAdd = useMemo(() => type === 'add', [type]);

    const handleRemove = useCallback(() => {
        setNewRows(prevItems => {
            const arr = prevItems;
            const arrNew = Object.assign(
                [],
                arr.filter(item => !selfSelectedRows.find(selectedRowId => selectedRowId === item.rowId)),
            );
            setSelfSelectedRows([]);
            return arrNew;
        });
    }, [selfSelectedRows]);

    const handleAdd = useCallback(() => {
        setNewRows(prevItems => {
            const arr = prevItems;
            arr.push({
                rowType: RowType.NEW,
                rowMode: RowModeType.UPDATE,
                rowId: getHashString(),
            });
            return Object.assign([], arr);
        });
    }, []);

    const handleCancel = useCallback(() => {
        dispatch(ModalStore.removeModal());
    }, []);

    const handleSubmit = useCallback(
        async function () {
            const options: AxiosRequestConfig = {
                method: 'PUT',
                data: {
                    [isTypeAdd ? 'create' : 'update']: isTypeAdd
                        ? newRows.map(item => {
                              const gates = [item.gateId1, item.gateId2, item.gateId3].filter(Boolean);
                              return {
                                  weight: Number(item.weight),
                                  mode: item.mode,
                                  destination: item.destination,
                                  gates,
                              };
                          })
                        : rowsChecked.map(item => {
                              const gates = [item.gateId1, item.gateId2, item.gateId3].filter(Boolean);
                              return {
                                  rule_id: item.ruleId,
                                  destination: item.destination,
                                  gates,
                                  mode: item.mode,
                                  weight: Number(item.weight),
                              };
                          }),
                    change_info: changeInfo,
                },
            };

            const response = await mutation(serverUrls.putRoutes, options);
            if (response && isSuccessMutation(response)) {
                handleCancel();
                dispatch(
                    ToastStore.notify({
                        message: `You have ${isTypeAdd ? 'added' : 'edited'} ${
                            isTypeAdd ? newRows.length : rowsChecked.length
                        } routes`,
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
        [isTypeAdd, newRows, rowsChecked, changeInfo],
    );

    const handleUpdateDataByHeader = useCallback(
        (accessor: string, value: any) => {
            let setValue = (prevItems: Array<RouteRowInterface>) => {
                return prevItems.map(item => ({
                    ...item,
                    [accessor]: value,
                }));
            };

            if (isTypeAdd) {
                setNewRows(setValue);
                return;
            }

            const gateKeys = ['gateId1', 'gateId2', 'gateId3'];
            if (gateKeys.includes(accessor)) {
                const gateRow = gateRows.find(item => item.gateId === value);
                setValue = (prevItems: Array<RouteRowInterface>) => {
                    return prevItems.map(item => ({
                        ...item,
                        [accessor]: value,
                        [`${accessor}Consumer`]: gateRow?.consumer,
                        [`${accessor}Fromname`]: gateRow?.fromname,
                        [`${accessor}Aliase`]: gateRow?.aliase,
                        [`${accessor}Protocol`]: gateRow?.protocol,
                    }));
                };
            }

            if (accessor === 'destination') {
                const regionRow = regionRows.find(item => item.prefix === value);
                setValue = (prevItems: Array<RouteRowInterface>) => {
                    return prevItems.map(item => ({
                        ...item,
                        [accessor]: value,
                        region: regionRow?.name,
                    }));
                };
            }

            setRowsChecked(setValue);
        },
        [regionRows, gateRows],
    );

    const handleUpdateDataByComponent = useCallback(
        (rowIndex: number, columnId: string, value: any) => {
            setNewRows(
                newRows.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...newRows[rowIndex],
                            [columnId]: value,
                        };
                    }
                    return row;
                }),
            );
        },
        [newRows],
    );

    const data = isTypeAdd ? newRows : rowsChecked;

    const WIDTH_OF_COLUMNS_TEXT = 90;
    const WIDTH_OF_COLUMNS_INPUT_SMALL = isTypeAdd ? 120 : 110;
    const WIDTH_OF_COLUMNS_INPUT = isTypeAdd ? 210 : 190;
    const WIDTH_OF_COLUMNS_INPUT_GATE = isTypeAdd ? 220 : 210;

    const columns = useMemo<Column<RouteRowInterface>[]>(() => {
        const arr: Column<RouteRowInterface>[] = [
            {
                accessor: 'weight',
                width: WIDTH_OF_COLUMNS_INPUT_SMALL,
                Header: (
                    <InputHeader
                        headerTitle="weight"
                        placeholder={getOneFromDuplicate(newRows.map(item => item.weight)) || 'mixed'}
                        defaultValue={weight}
                        autoFocus={focWeight}
                        onBlur={() => {
                            setFocWeight(false);
                        }}
                        onFocus={() => {
                            setFocWeight(true);
                        }}
                        onChange={e => {
                            setWeight(e.target.value);
                            handleUpdateDataByHeader('weight', e.target.value);
                        }}
                    />
                ),
            },
            {
                accessor: 'destination',
                width: WIDTH_OF_COLUMNS_INPUT,
                Header: (
                    <ComboBoxHeader
                        headerTitle="destination"
                        placeholder={getOneFromDuplicate(newRows.map(item => item.destination)) || 'mixed'}
                        defaultValue={{ value: region, content: '' }}
                        onChange={(item: IItem) => {
                            setRegion(item.value || '');
                            handleUpdateDataByHeader('destination', item.value);
                        }}
                        options={regionRows.map(item => ({
                            value: item.prefix,
                            content: item.name,
                        }))}
                    />
                ),
                Cell: ({ row }) => {
                    const values = row.original;

                    const has = [values.destination, values.region].filter(Boolean).length;

                    return has ? (
                        <Text typography="control-m">
                            {values.destination}{' '}
                            <Text typography="control-m" color={'secondary'}>
                                <br />
                                {values.region}
                            </Text>
                        </Text>
                    ) : (
                        '-'
                    );
                },
            },
            {
                accessor: 'mode',
                width: WIDTH_OF_COLUMNS_INPUT_SMALL,
                Header: (
                    <InputHeader
                        headerTitle="mode"
                        placeholder={getOneFromDuplicate(newRows.map(item => item.mode)) || 'mixed'}
                        defaultValue={mode}
                        autoFocus={focMode}
                        onBlur={() => {
                            setFocMode(false);
                        }}
                        onFocus={() => {
                            setFocMode(true);
                        }}
                        onChange={e => {
                            setMode(e.target.value);
                            handleUpdateDataByHeader('mode', e.target.value);
                        }}
                    />
                ),
            },
            {
                accessor: 'gateId1',
                width: WIDTH_OF_COLUMNS_INPUT_GATE,
                Header: (
                    <ComboBoxHeader
                        headerTitle="gateid"
                        placeholder={getOneFromDuplicate(newRows.map(item => item.gateId1)) || 'mixed'}
                        defaultValue={{ value: gateId1, content: '' }}
                        onChange={(item: IItem) => {
                            setGateId1(item.value || '');
                            handleUpdateDataByHeader('gateId1', item.value);
                        }}
                        options={[
                            { value: '', content: '' },
                            ...gateRows.map(item => ({ value: item.gateId, content: getGateContent(item) })),
                        ]}
                    />
                ),
                Cell: ({ row }) => {
                    const values = row.original;

                    const has = [
                        values.gateId1,
                        values.gateId1Fromname,
                        values.gateId1Consumer,
                        values.gateId1Aliase,
                        values.gateId1Protocol,
                    ].filter(Boolean).length;

                    return has ? (
                        <Text typography="control-m">
                            {values.gateId1}{' '}
                            <Text typography="control-m" color={'secondary'}>
                                {values.gateId1Fromname}
                                <br />
                                {values.gateId1Consumer || '-'} • {values.gateId1Aliase || '-'} •{' '}
                                {values.gateId1Protocol || '-'}
                            </Text>
                        </Text>
                    ) : (
                        '-'
                    );
                },
            },
            {
                accessor: 'gateId2',
                width: WIDTH_OF_COLUMNS_INPUT_GATE,
                Header: (
                    <ComboBoxHeader
                        headerTitle="gateId2"
                        placeholder={getOneFromDuplicate(newRows.map(item => item.gateId2)) || 'mixed'}
                        defaultValue={{ value: gateId2, content: '' }}
                        onChange={(item: IItem) => {
                            setGateId2(item.value || '');
                            handleUpdateDataByHeader('gateId2', item.value);
                        }}
                        options={[
                            { value: '', content: '' },
                            ...gateRows.map(item => ({ value: item.gateId, content: getGateContent(item) })),
                        ]}
                    />
                ),
                Cell: ({ row }) => {
                    const values = row.original;

                    const has = [
                        values.gateId2,
                        values.gateId2Fromname,
                        values.gateId2Consumer,
                        values.gateId2Aliase,
                        values.gateId2Protocol,
                    ].filter(Boolean).length;

                    return has ? (
                        <Text typography="control-m">
                            {values.gateId2}{' '}
                            <Text typography="control-m" color={'secondary'}>
                                {values.gateId2Fromname}
                                <br />
                                {values.gateId2Consumer || '-'} • {values.gateId2Aliase || '-'} •{' '}
                                {values.gateId2Protocol || '-'}
                            </Text>
                        </Text>
                    ) : (
                        '-'
                    );
                },
            },
            {
                accessor: 'gateId3',
                width: WIDTH_OF_COLUMNS_INPUT_GATE,
                Header: (
                    <ComboBoxHeader
                        headerTitle="gateId3"
                        placeholder={getOneFromDuplicate(newRows.map(item => item.gateId3)) || 'mixed'}
                        defaultValue={{ value: gateId3, content: '' }}
                        onChange={(item: IItem) => {
                            setGateId3(item.value || '');
                            handleUpdateDataByHeader('gateId3', item.value);
                        }}
                        options={[
                            { value: '', content: '' },
                            ...gateRows.map(item => ({ value: item.gateId, content: getGateContent(item) })),
                        ]}
                    />
                ),
                Cell: ({ row }) => {
                    const values = row.original;

                    const has = [
                        values.gateId3,
                        values.gateId3Fromname,
                        values.gateId3Consumer,
                        values.gateId3Aliase,
                        values.gateId3Protocol,
                    ].filter(Boolean).length;

                    return has ? (
                        <Text typography="control-m">
                            {values.gateId3}{' '}
                            <Text typography="control-m" color={'secondary'}>
                                {values.gateId3Fromname}
                                <br />
                                {values.gateId3Consumer || '-'} • {values.gateId3Aliase || '-'} •{' '}
                                {values.gateId3Protocol || '-'}
                            </Text>
                        </Text>
                    ) : (
                        '-'
                    );
                },
            },
        ];

        if (!isTypeAdd) {
            arr.unshift({
                Header: 'rule_id',
                accessor: 'ruleId',
                width: WIDTH_OF_COLUMNS_TEXT,
            });
        } else {
            for (let i = 0; i < arr.length; ++i) {
                const item: any = arr[i];
                delete item.Cell;
            }
        }

        return arr;
    }, [isTypeAdd, rows, newRows, focWeight, focMode, region, gateId1, gateId2, gateId3]);

    const saveButtonDisabled =
        (Boolean(status) && status === FetchStatus.LOADING) ||
        !changeInfo?.issue?.[0].length ||
        !changeInfo?.comment?.length ||
        Boolean(changeInfoError?.length);

    return (
        <Modal theme="normal" visible hasAnimation>
            <div className={styles.modal}>
                <div className={styles.modal__inner}>
                    <div className={styles.modal__header}>
                        <div className={styles.modal__title}>
                            <Text typography="headline-l" weight="bold">
                                You are {isTypeAdd ? 'adding' : 'editing'}{' '}
                                {isTypeAdd ? newRows.length : selectedRows.length} routes
                            </Text>
                        </div>
                        <div className={styles.modal__close}>
                            <Button onClick={handleCancel}>
                                <Icon glyph={'type-cross-websearch'} />
                            </Button>
                        </div>
                    </div>
                    <div className={styles.modal__changeinfo}>
                        <ChangeInfo info={changeInfo} setInfo={setChangeInfo} setError={setChangeInfoError} />
                    </div>
                    <div className={styles.modal__table}>
                        <TableCustom
                            headerHeightM
                            withoutLRBorders
                            withoutCheckbox={!isTypeAdd}
                            align="left"
                            status={status}
                            data={data}
                            columns={columns}
                            handleUpdateData={isTypeAdd ? handleUpdateDataByComponent : undefined}
                            EditComponent={isTypeAdd ? EditComponent : undefined}
                            handleSelectRows={
                                isTypeAdd
                                    ? (selectedOriginRows: Array<RouteRowInterface>) => {
                                          setSelfSelectedRows(selectedOriginRows.map(item => String(item.rowId)));
                                      }
                                    : undefined
                            }
                        />
                    </div>

                    <DisplayObj className={error ? styles.modal__feedback : ''} value={error} />

                    {isTypeAdd && (
                        <div className={styles.modal__control}>
                            <div className={styles.modal__remove}>
                                <Button view="pseudo" onClick={handleRemove}>
                                    <Text typography="control-xl" weight="medium">
                                        -
                                    </Text>
                                </Button>
                            </div>
                            <div className={styles.modal__add}>
                                <Button view="pseudo" onClick={handleAdd}>
                                    <Text typography="control-xl" weight="medium">
                                        +
                                    </Text>
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className={styles.modal__action}>
                        <div className={styles.modal__cancel}>
                            <Button view="default" onClick={handleCancel}>
                                <Text typography="control-l" weight="medium">
                                    cancel
                                </Text>
                            </Button>
                        </div>
                        <div className={styles.modal__submit}>
                            <Button view="action" disabled={saveButtonDisabled} onClick={handleSubmit}>
                                <Text typography="control-l" weight="medium">
                                    save
                                </Text>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export { ModalMutation };
