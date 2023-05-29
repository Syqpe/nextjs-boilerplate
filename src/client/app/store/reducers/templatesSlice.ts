import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Template } from '@cshared/types/yasms';
import { TemplateRowInterface, RowModeType, RowType } from '@cshared/types/tables';
import { getHashString } from '@cshared/utils/getHashString';

import type { AppState } from '@client/app/store';

const getRow = (item: Template): TemplateRowInterface => {
    return {
        id: item.id,
        text: item.text,
        abcService: item.abc_service,

        sender: JSON.stringify(item.sender, null, 2),
        senderMeta: JSON.stringify(item.sender_meta, null, 2),
        fieldsDescription: JSON.stringify(item.fields_description, null, 2),

        auditCreate: item.audit_create,
        auditModify: item.audit_modify,

        rowType: RowType.OLD,
        rowMode: RowModeType.DEFAULT,
        rowId: getHashString(),
    };
};

interface InitialState {
    loading: boolean;
    items: Array<TemplateRowInterface>;
}

const initialState: InitialState = {
    loading: false,
    items: [],
};

export const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setTemplates: (state, action: PayloadAction<Array<Template>>) => {
            state.items = action.payload.map(getRow);
        },
        addTemplates: (state, action: PayloadAction<Array<Template>>) => {
            state.items = state.items.concat(...action.payload.map(getRow));
        },
    },
});

export const { setLoading, setTemplates, addTemplates } = templatesSlice.actions;

const selectLoadingFunc = (state: AppState) => state.templates.loading;
const selectItemsFunc = (state: AppState) => state.templates.items;

export const selectItems = createSelector(selectItemsFunc, items => items);
export const selectLoading = createSelector(selectLoadingFunc, loading => loading);

export default templatesSlice.reducer;
