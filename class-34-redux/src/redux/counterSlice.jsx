import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counterSlice",
    initialState:{
        count: 5,
        name: "Abhilash",
        isUserLoggedIn: true
    },
    //update the state
});

export default counterSlice