import {createSlice} from "@reduxjs/toolkit";

const todoSlice = createSlice({
    name: "todoSlice",
    initialState:{
        todoList:["task1", "task2"],
        value: ""
    },
    reducers:{
        setValue: (state, obj) => {
            console.log("i am set value", obj);
            state.value = obj.payload;
        },
        addTask:(state, obj) => {
            console.log("i am called");
            console.log(obj);
            let updatedTask = [...state.todoList, obj.payload];
            state.todoList=updatedTask;
            state.value="";
        }
    }
})

export default todoSlice;