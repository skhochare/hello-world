import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./counterSlice";
import todoSlice from "./TodoSlice";
console.log(counterSlice);
const mystore = configureStore({
    reducer:{
        //is a slice of our global store 
        counterState: counterSlice.reducer,    
        todoState: todoSlice.reducer
    }
});

export default mystore;