import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Blokedphones } from '@cshared/types/yasms';
import { BlockedphoneRowInterface, RowType, RowModeType } from '@cshared/types/tables';
import { getHashString } from '@cshared/utils/getHashString';

import type { AppState } from '@client/app/store';

const getRow = (item: Blokedphones): BlockedphoneRowInterface => {
    return {
        ...item,

        auditCreate: item.audit_create,
        auditModify: item.audit_modify,

        rowType: RowType.OLD,
        rowMode: RowModeType.DEFAULT,
        rowId: getHashString(),
    } as BlockedphoneRowInterface;
};

interface InitialState {
    loading: boolean;
    items: Array<BlockedphoneRowInterface>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const blockedphonesSlice = createSlice({
    name: 'blockedphones',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setBlockedphoneRows: (state, action: PayloadAction<Array<BlockedphoneRowInterface>>) => {
            state.items = action.payload;
        },
        setBlockedphoneRow: (state, action: PayloadAction<BlockedphoneRowInterface>) => {
            const arr = state.items;
            arr.push(action.payload);
            state.items = arr;
        },
        setBlockedphones: (state, action: PayloadAction<Array<Blokedphones>>) => {
            state.items = action.payload.map(getRow);
        },
        addBlockedphones: (state, action: PayloadAction<Array<Blokedphones>>) => {
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

export const { setLoading, setBlockedphoneRows, setBlockedphoneRow, setBlockedphones, addBlockedphones, handleEdit } =
    blockedphonesSlice.actions;

const selectLoadingFunc = (state: AppState) => state.blockedphones.loading;
const selectItemsFunc = (state: AppState) => state.blockedphones.items;

export const selectLoading = createSelector(selectLoadingFunc, loading => loading);
export const selectItems = createSelector(selectItemsFunc, items => items);

export default blockedphonesSlice.reducer;
