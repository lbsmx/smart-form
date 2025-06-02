import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortableItemProps } from '@/app/form/[id]/components/sortable-item/sortable-item';

// 定义 state 类型
export interface FieldState {
    formLib: Record<string, SortableItemProps[]>;
}

// 初始化状态
const initialState: FieldState = {
    formLib: {},
};

// 创建 slice
const fieldSlice = createSlice({
    name: 'field',
    initialState,
    reducers: {
        // setFormLib 支持直接设置值或传入一个更新函数
        setFormLib(
            state,
            action: PayloadAction<
                | Record<string, SortableItemProps[]>
                | ((
                      prev: Record<string, SortableItemProps[]>
                  ) => Record<string, SortableItemProps[]>)
            >
        ) {
            if (typeof action.payload === 'function') {
                return {
                    ...state,
                    formLib: action.payload(state.formLib),
                };
            } else {
                return {
                    ...state,
                    formLib: action.payload,
                };
            }
        },
    },
});

// 导出 action 和 reducer
export const { setFormLib } = fieldSlice.actions;
export default fieldSlice.reducer;
