import React, { memo, useCallback, FC, ChangeEvent, FocusEvent } from 'react';
import { useAppDispatch } from '@client/shared/hooks/store-hooks';
import { useAppSelector } from '@client/shared/hooks/store-hooks';
import { selectItems as selectGates } from '@client/app/store/reducers/gatesSlice';
import { selectItems as selectRegions } from '@client/app/store/reducers/regionsSlice';
import { setLoading } from '@client/app/store/reducers/routesSlice';

import { Input, ComboBox, Text } from '@ccomponents/index';

import { EditComponentProps } from '@ccomponents/TableCustom';
import { GateRowInterface, RegionRowInterface, RouteRowInterface } from '@cshared/types/tables';

export const EditComponent: FC<EditComponentProps<RouteRowInterface, any>> = memo(
    ({ value, setValue, columnId, handleSaveValue }) => {
        const dispatch = useAppDispatch();
        const gateRows: Array<GateRowInterface> = useAppSelector(selectGates);
        const regionRows: Array<RegionRowInterface> = useAppSelector(selectRegions);

        const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            dispatch(setLoading(true));
            setValue(event.target.value);
        }, []);
        const handleComboBoxChange = useCallback(item => {
            dispatch(setLoading(true));
            setValue(item.value);
            handleSaveValue(item.value);
        }, []);
        const handleBlur = useCallback((event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
            handleSaveValue(event.target.value);
        }, []);

        const fItem = regionRows.find(item => item.prefix === value);

        switch (columnId) {
            case 'weight':
            case 'mode':
                return (
                    <Input
                        size="m"
                        view="default"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type={columnId === 'weight' ? 'number' : 'text'}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                );
            case 'destination':
                return (
                    <ComboBox
                        style={{ width: '100%' }}
                        defaultValue={{ value: fItem?.prefix, content: fItem?.name }}
                        options={regionRows.map(item => ({
                            value: item.prefix || '',
                            content: item.name || '',
                        }))}
                        onChange={item => {
                            handleSaveValue(item.value);
                        }}
                    />
                );
            case 'gateId1':
            case 'gateId2':
            case 'gateId3':
                return (
                    <ComboBox
                        style={{ width: '100%' }}
                        defaultValue={{ value: value, content: '' }}
                        options={[
                            { value: '', content: '' },
                            ...gateRows.map(item => ({
                                value: item.gateId,
                                content: `${item.fromname || '-'} • ${item.consumer || '-'} • ${item.aliase || '-'} • ${
                                    item.protocol || '-'
                                }`,
                            })),
                        ]}
                        onChange={handleComboBoxChange}
                    />
                );
            default:
                return <Text weight="regular">{value}</Text>;
        }
    },
    (prevProps, nextProps) => {
        return prevProps.value === nextProps.value && prevProps.columnId === nextProps.columnId;
    },
);
