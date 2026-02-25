import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CounterRedux from "./reduxComponents/CounterRedux";
import TodoRedux from "./reduxComponents/TodoRedux";
function App() {
  return (
      // <CounterRedux></CounterRedux>
      <TodoRedux/>
  );
}

export default App;
