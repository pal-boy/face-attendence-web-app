import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/authSlice.js";

const store = configureStore({
    reducer: {
        auth : authSliceReducer,
    },
    devTools: true
});

export default store;