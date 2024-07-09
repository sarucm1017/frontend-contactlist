import { configureStore } from "@reduxjs/toolkit";
import contactReducer from './contactSlice';

const store = configureStore({
    reducer: {
        data: contactReducer,
    },
});


export default store;