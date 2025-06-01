import { createSlice } from '@reduxjs/toolkit';

const fieldSlice = createSlice({
    name: 'field',
    initialState: {
        formLib: [],
    },
    reducers: {
        setFormLib(state, action) {
            state.formLib = action.payload;
        },
    },
});

export const { setFormLib } = fieldSlice.actions;

export default fieldSlice.reducer;
