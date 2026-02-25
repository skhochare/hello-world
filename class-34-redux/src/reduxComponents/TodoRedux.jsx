import React from "react";
import {useSelector, useDispatch} from "react-redux"
import todoSlice from "../redux/TodoSlice";
const actions = todoSlice.actions;
function TodoRedux() {
  const {todoList:list, value} = useSelector((store) => {
    return store.todoState;
  })

  const dispatch = useDispatch();
  const handleChange = (e) => {
    //update value state
    dispatch(actions.setValue(e.target.value));
  }

  const handleTask = () => {
    dispatch(actions.addTask(value));
  }
  return (
    <>
      <h2>Todo</h2>
      <div>
        <div className="inputBox">
          <input type="text" placeholder="write your task.." value={value} onChange={handleChange}></input>
          <button onClick={handleTask}>Add</button>
        </div>
        <div className="list">
          <ul>
            {list.map((task, idx) => {
              return <li key={idx}>{task}</li>;
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default TodoRedux;
