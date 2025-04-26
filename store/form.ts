import { SortableItemProps } from '@/app/form/[id]/components/sortable-item/sortable-item';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface FormState {
    formId: string | undefined;
    formTitle: string;
    formList: SortableItemProps[];
}

export const updateForm = createAsyncThunk(
    'form/updateForm',
    async (
        {
            type,
            data,
        }: {
            type: string;
            data: any;
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
                    data: {
                        ...data,
                        formList: formState.formList,
                    },
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

const formSlice = createSlice({
    name: 'form',
    initialState: {
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
    },
    extraReducers: (builder) => {
        builder.addCase(updateForm.pending, (state, action) => {});
        builder.addCase(updateForm.fulfilled, (state, action) => {
            // TODO 在header更新状态
            const { type, form } = action.payload;
            switch (type) {
                case 'formItem':
                case 'formList':
                    state.formList = form.formList;
                    break;
                case 'formTitle':
                    state.formTitle = form.title;
                    break;
            }
        });
    },
});

export const { setForm, setFormList } = formSlice.actions;

export default formSlice.reducer;
