import { SortableItemProps } from '@/app/form/[id]/components/sortable-item/sortable-item';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { UniqueIdentifier } from '@dnd-kit/core';
import FieldType from '@/app/form/[id]/components/form-item/field-types';
import HistoryManager from '@/utils/history-manager';

interface FormState {
    formId: string | undefined;
    formTitle: string;
    formList: SortableItemProps[];
    editable: boolean;
}

interface updatedFormListParams {
    formList: SortableItemProps[];
    id: UniqueIdentifier;
    updated: Partial<FieldType>;
}

export const updateFormList = ({
    formList,
    id,
    updated,
}: updatedFormListParams): SortableItemProps[] => {
    const itemIndex = formList.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
        const updatedFormList = formList.map((item, index) =>
            index === itemIndex ? { ...item, ...updated } : item
        );
        return updatedFormList;
    } else {
        return formList;
    }
};

export enum FormUpdateType {
    UpdateItem = 'formItem/update',
    DeleteItem = 'formItem/delete',
    AddItem = 'formItem/add',
    SortList = 'formList/sort',
    UpdateTitle = 'formTitle/update',
}

export const updateForm = createAsyncThunk(
    'form/updateForm',
    async (
        {
            type,
            data,
            history = false, // 确认是否是由于undo/redo而导致表单更新，默认为false
        }: {
            type: FormUpdateType;
            data: any;
            history?: boolean;
        },
        thunkAPI
    ) => {
        const state = thunkAPI.getState() as RootState;
        const formState = state.form;
        try {
            const res = await fetch('/api/form', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId: formState.formId,
                    type,
                    data,
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to update form');
            }
            return res.json();
        } catch (error) {
            console.log(error);
        }
    }
);

// 声明undo/redo实例
export const historyManager = new HistoryManager();

const formSlice = createSlice({
    name: 'form',
    initialState: {
        editable: true,
        formId: undefined,
        formTitle: '表单标题',
        formList: [],
    } as FormState,
    reducers: {
        setForm(
            state,
            action: PayloadAction<{
                formId: string;
                formTitle: string;
                formList: SortableItemProps[];
            }>
        ) {
            const { formId, formTitle, formList } = action.payload;
            state.formId = formId;
            state.formTitle = formTitle;
            state.formList = formList;
        },
        setFormList(state, action: PayloadAction<SortableItemProps[]>) {
            state.formList = action.payload;
        },
        setEditable(state, action: PayloadAction<boolean>) {
            state.editable = action.payload;
        },
    },
    extraReducers: (builder) => {
        // pending状态下乐观更新数据，防止拖拽等行为发生意料之外的效果
        builder.addCase(updateForm.pending, (state, action) => {
            const { type, data, history } = action.meta.arg;
            // 如果不是由于undo/redo而导致表单更新，才添加到historyManager中
            // 以防止操作被重复记录
            if (!history) {
                historyManager.add({ action: type, data });
            }
            switch (type) {
                case FormUpdateType.UpdateItem:
                    const updatedFormList = updateFormList({
                        formList: state.formList,
                        id: data.id,
                        updated: data.updated,
                    });
                    state.formList = updatedFormList;
                    break;
                case FormUpdateType.AddItem:
                    const { index, newItem } = data;
                    state.formList = [
                        ...state.formList.slice(0, index),
                        newItem,
                        ...state.formList.slice(index),
                    ];
                    break;
                case FormUpdateType.DeleteItem:
                    state.formList = state.formList.filter(
                        (item) => item.id !== data.item.id
                    );
                    break;
                case FormUpdateType.SortList:
                    const copyFormList = [...state.formList];
                    const [moveItem] = copyFormList.splice(data.oldIndex, 1);
                    copyFormList.splice(data.newIndex, 0, moveItem);
                    state.formList = copyFormList;
                    break;
                case FormUpdateType.UpdateTitle:
                    state.formTitle = data.formTitle;
                    break;
            }
        });
        // TODO
        builder.addCase(updateForm.fulfilled, (state, action) => {
            // TODO 在header更新状态
            // const { type, form } = action.payload;
            // switch (type) {
            //     case 'formItem':
            //     case 'formList':
            //         state.formList = form.formList;
            //         break;
            //     case 'formTitle':
            //         state.formTitle = form.title;
            //         break;
            // }
        });
    },
});

export const { setForm, setFormList, setEditable } = formSlice.actions;

export default formSlice.reducer;
