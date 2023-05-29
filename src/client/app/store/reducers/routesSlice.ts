import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Route } from '@cshared/types/yasms';
import { RouteRowInterface, RowType, RowModeType } from '@cshared/types/tables';
import { getHashString } from '@cshared/utils/getHashString';

import type { AppState } from '@client/app/store';

const getRow = (item: Route): RouteRowInterface => {
    return {
        ruleId: item.rule_id,
        destination: item.destination,

        gateId1: item.gates[0]?.gateid,
        gateId2: item.gates[1]?.gateid,
        gateId3: item.gates[2]?.gateid,

        mode: item.mode,
        weight: item.weight,
        region: item.region.name,

        gateId1Consumer: item.gates[0]?.consumer,
        gateId1Fromname: item.gates[0]?.fromname,
        gateId1Aliase: item.gates[0]?.aliase,
        gateId1Protocol: item.gates[0]?.protocol,

        gateId2Consumer: item.gates[1]?.consumer,
        gateId2Fromname: item.gates[1]?.fromname,
        gateId2Aliase: item.gates[1]?.aliase,
        gateId2Protocol: item.gates[1]?.protocol,

        gateId3Consumer: item.gates[2]?.consumer,
        gateId3Fromname: item.gates[2]?.fromname,
        gateId3Aliase: item.gates[2]?.aliase,
        gateId3Protocol: item.gates[2]?.protocol,

        auditCreate: item.audit_create,
        auditModify: item.audit_modify,

        rowType: RowType.OLD,
        rowMode: RowModeType.DEFAULT,
        rowId: getHashString(),
    } as RouteRowInterface;
};

interface InitialState {
    loading: boolean;
    items: Array<RouteRowInterface>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const routesSlice = createSlice({
    name: 'routes',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setRouteRows: (state, action: PayloadAction<Array<RouteRowInterface>>) => {
            state.items = action.payload;
        },
        setRouteRow: (state, action: PayloadAction<RouteRowInterface>) => {
            const arr = state.items;
            arr.push(action.payload);
            state.items = arr;
        },
        setRoutes: (state, action: PayloadAction<Array<Route>>) => {
            state.items = action.payload.map(getRow);
        },
        addRoutes: (state, action: PayloadAction<Array<Route>>) => {
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

export const { setLoading, setRouteRows, setRouteRow, setRoutes, addRoutes, handleEdit } = routesSlice.actions;

const selectLoadingFunc = (state: AppState) => state.routes.loading;
const selectItemsFunc = (state: AppState) => state.routes.items;

export const selectLoading = createSelector(selectLoadingFunc, loading => loading);
export const selectItems = createSelector(selectItemsFunc, items => items);

export default routesSlice.reducer;
