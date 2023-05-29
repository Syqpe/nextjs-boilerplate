import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region } from '@cshared/types/yasms';
import { RegionRowInterface, RowModeType, RowType } from '@cshared/types/tables';
import { getHashString } from '@cshared/utils/getHashString';

import type { AppState } from '@client/app/store';

const getRow = (item: Region): RegionRowInterface => {
    return {
        id: item.id,
        prefix: item.prefix,
        name: item.name,

        auditCreate: item.audit_create,
        auditModify: item.audit_modify,

        rowType: RowType.OLD,
        rowMode: RowModeType.DEFAULT,
        rowId: getHashString(),
    };
};

interface InitialState {
    loading: boolean;
    items: Array<RegionRowInterface>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const regionsSlice = createSlice({
    name: 'regions',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setRegionRows: (state, action: PayloadAction<Array<RegionRowInterface>>) => {
            state.items = action.payload;
        },
        setRegionRow: (state, action: PayloadAction<RegionRowInterface>) => {
            const arr = state.items;
            arr.push(action.payload);
            state.items = arr;
        },
        setRegions: (state, action: PayloadAction<Array<Region>>) => {
            state.items = action.payload.map(getRow);
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

export const { setLoading, setRegionRows, setRegionRow, setRegions, handleEdit } = regionsSlice.actions;

const selectLoadingFunc = (state: AppState) => state.regions.loading;
const selectItemsFunc = (state: AppState) => state.regions.items;

export const selectItems = createSelector(selectItemsFunc, items => items);
export const selectLoading = createSelector(selectLoadingFunc, loading => loading);

export default regionsSlice.reducer;
