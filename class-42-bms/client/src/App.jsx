import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles
import './App.css'
import "antd/dist/reset.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import PNF from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<PNF />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
