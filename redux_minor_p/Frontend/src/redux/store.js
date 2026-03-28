import {configureStore} from "@reduxjs/toolkit";
import noteSlice from "./slice/noteSlice";

export const store = configureStore({
    reducer: {
        note: noteSlice
    }
});
