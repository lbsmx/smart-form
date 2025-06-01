import { configureStore } from '@reduxjs/toolkit';
import formSliceReducer from './form';
import fieldSliceReducer from './field';

const store = configureStore({
    reducer: {
        form: formSliceReducer,
        field: fieldSliceReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;

export type AppDispatch = typeof store.dispatch;
