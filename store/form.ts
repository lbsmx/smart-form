import { SortableItemProps } from '@/app/form/[id]/components/sortable-item/sortable-item';
import { UniqueIdentifier } from '@dnd-kit/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
    formList: SortableItemProps[];
}

const formSlice = createSlice({
    name: 'form',
    initialState: {
        formList: [],
    } as FormState,
    reducers: {
        setFormList(state, action: PayloadAction<SortableItemProps[]>) {
            state.formList = action.payload;
        },
        updateFormItem(
            state,
            action: PayloadAction<{
                id: UniqueIdentifier;
                updatedItem: Partial<SortableItemProps>;
            }>
        ) {
            const { id, updatedItem } = action.payload;
            const itemIndex = state.formList.findIndex(
                (item) => item.id === id
            );
            if (itemIndex !== -1) {
                state.formList[itemIndex] = {
                    ...state.formList[itemIndex],
                    ...updatedItem,
                };
            }
        },
    },
});

export const { setFormList, updateFormItem } = formSlice.actions;

export default formSlice.reducer;
