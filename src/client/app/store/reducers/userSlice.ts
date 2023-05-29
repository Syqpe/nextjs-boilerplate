import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from '@cshared/types/blackbox';

import type { AppState } from '@client/app/store';

interface InitialState extends State {
    loading: boolean;
}

const initialState: Partial<InitialState> = {
    loading: false,
    cookies: {},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUserData: (state, action: PayloadAction<Partial<InitialState>>) => {
            Object.assign(state, action.payload);
        },
    },
});

export const { setUserData } = userSlice.actions;

const selectUserFunc = (state: AppState) => state.user;

export const selectUser = createSelector(selectUserFunc, user => user);

export default userSlice.reducer;
