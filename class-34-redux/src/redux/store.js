import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";

const mystore = configureStore({
    reducer:{
        counterState: counterSlice.reducer
    }
});

export default mystore;