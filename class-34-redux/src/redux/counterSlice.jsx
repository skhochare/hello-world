import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: "counterSlice",
    initialState:{
        count: 5,
        name: "Abhilash",
        isUserLoggedIn: true
    },
    //update the state
    //reducer is a function that tells redux how the state should change
    reducers:{
        //in the state we will get the initial state initially and that is updated 
        increment:(state) => {
            state.count+=1;
        },
        decrement:(state) => {
            state.count-=1;
        }
    }
});

export default counterSlice



// reducer(state, action){
//     switch(action.type){
//         case "increment":
//             return state+1
//         case "decrement":
//             return state -1;
//     }
// }