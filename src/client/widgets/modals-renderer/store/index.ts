import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '@client/app/store';

interface InitialState {
    loading: boolean;
    items: Array<JSX.Element>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setModals: (state, action: PayloadAction<Array<JSX.Element>>) => {
            state.items = action.payload;
        },
        addModal: (state, action: PayloadAction<JSX.Element>) => {
            const arr = state.items;
            arr.push(action.payload);
            state.items = arr;
        },
        removeModal: state => {
            const arr = state.items;
            arr.pop();
            state.items = arr;
        },
    },
});

export const { setLoading, setModals, addModal, removeModal } = modalsSlice.actions;

const selectLoadingFunc = (state: AppState) => state.modals.loading;
const selectItemsFunc = (state: AppState) => state.modals.items;

export const selectLoading = createSelector(selectLoadingFunc, loading => loading);
export const selectItems = createSelector(selectItemsFunc, items => items);

export default modalsSlice.reducer;
