import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Fallback } from '@cshared/types/yasms';
import { FallbackRowInterface, RowType, RowModeType } from '@cshared/types/tables';
import { getHashString } from '@cshared/utils/getHashString';

import type { AppState } from '@client/app/store';

const getRow = (item: Fallback): FallbackRowInterface => {
    return {
        ...item,

        auditCreate: item.audit_create,
        auditModify: item.audit_modify,

        rowType: RowType.OLD,
        rowMode: RowModeType.DEFAULT,
        rowId: getHashString(),
    } as FallbackRowInterface;
};

interface InitialState {
    loading: boolean;
    items: Array<FallbackRowInterface>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const fallbacksSlice = createSlice({
    name: 'fallbacks',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setFallbackRows: (state, action: PayloadAction<Array<FallbackRowInterface>>) => {
            state.items = action.payload;
        },
        setFallbackRow: (state, action: PayloadAction<FallbackRowInterface>) => {
            const arr = state.items;
            arr.push(action.payload);
            state.items = arr;
        },
        setFallbacks: (state, action: PayloadAction<Array<Fallback>>) => {
            state.items = action.payload.map(getRow);
        },
        addFallbacks: (state, action: PayloadAction<Array<Fallback>>) => {
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

export const { setLoading, setFallbackRows, setFallbackRow, setFallbacks, addFallbacks, handleEdit } =
    fallbacksSlice.actions;

const selectLoadingFunc = (state: AppState) => state.fallbacks.loading;
const selectItemsFunc = (state: AppState) => state.fallbacks.items;

export const selectLoading = createSelector(selectLoadingFunc, loading => loading);
export const selectItems = createSelector(selectItemsFunc, items => items);

export default fallbacksSlice.reducer;
