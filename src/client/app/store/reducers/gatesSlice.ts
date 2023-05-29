import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Gate } from '@cshared/types/yasms';
import { GateRowInterface, RowType, RowModeType } from '@cshared/types/tables';
import { getHashString } from '@cshared/utils/getHashString';

import type { AppState } from '@client/app/store';

const getRow = (item: Gate): GateRowInterface => {
    return {
        gateId: item.gateid,
        aliase: item.aliase,
        protocol: item.protocol,

        fromname: item.fromname,

        consumer: item.consumer,
        contractor: item.contractor,

        extra: item.extra,

        auditCreate: item.audit_create,
        auditModify: item.audit_modify,

        rowType: RowType.OLD,
        rowMode: RowModeType.DEFAULT,
        rowId: getHashString(),
    } as GateRowInterface;
};

interface InitialState {
    loading: boolean;
    items: Array<GateRowInterface>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const gatesSlice = createSlice({
    name: 'gates',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setGateRows: (state, action: PayloadAction<Array<GateRowInterface>>) => {
            state.items = action.payload;
        },
        setGateRow: (state, action: PayloadAction<GateRowInterface>) => {
            const arr = state.items;
            arr.push(action.payload);
            state.items = arr;
        },
        setGates: (state, action: PayloadAction<Array<Gate>>) => {
            state.items = action.payload.map(getRow);
        },
        addGates: (state, action: PayloadAction<Array<Gate>>) => {
            state.items = state.items.concat(...action.payload.map(getRow));
        },
        handleEdit: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.items = state.items.map(item =>
                Boolean(item) && Boolean(id) && item.rowId === id
                    ? {
                          ...item,
                          rowMode: item.rowMode === RowModeType.DEFAULT ? RowModeType.UPDATE : RowModeType.DEFAULT,
                          rowType: RowType.UPDATED,
                      }
                    : item,
            );
        },
    },
});

export const { setLoading, setGateRows, setGateRow, setGates, addGates, handleEdit } = gatesSlice.actions;

const selectLoadingFunc = (state: AppState) => state.gates.loading;
const selectItemsFunc = (state: AppState) => state.gates.items;

export const selectLoading = createSelector(selectLoadingFunc, loading => loading);
export const selectItems = createSelector(selectItemsFunc, items => items);

export default gatesSlice.reducer;
