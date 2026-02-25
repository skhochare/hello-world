import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CounterRedux from "./reduxComponents/CounterRedux";
function App() {
  return (
      <CounterRedux></CounterRedux>
  );
}

export default App;
