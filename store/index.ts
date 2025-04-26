import { configureStore } from '@reduxjs/toolkit';
import formSliceReducer from './form';

const store = configureStore({
    reducer: {
        form: formSliceReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;

export type AppDispatch = typeof store.dispatch;
