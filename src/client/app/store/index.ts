import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import toastsSlice from '@cwidgets/toasts-renderer/store';
import modalsSlice from '@cwidgets/modals-renderer/store';

import routesReducer from './reducers/routesSlice';
import gatesReducer from './reducers/gatesSlice';
import fallbacksReducer from './reducers/fallbacksSlice';
import blockedphonesSlice from './reducers/blockedphonesSlice';
import regionsSlice from './reducers/regionsSlice';
import templatesSlice from './reducers/templatesSlice';
import userSlice from './reducers/userSlice';

export function makeStore() {
    return configureStore({
        reducer: {
            user: userSlice,
            routes: routesReducer,
            gates: gatesReducer,
            fallbacks: fallbacksReducer,
            blockedphones: blockedphonesSlice,
            regions: regionsSlice,
            templates: templatesSlice,

            modals: modalsSlice,
            toasts: toastsSlice,
        },
    });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export { store };
