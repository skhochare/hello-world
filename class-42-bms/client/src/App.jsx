import { BrowserRouter, Routes, Route } from "react-router-dom";

// Styles
import './App.css'
import "antd/dist/reset.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/admin";
import PNF from "./pages/PageNotFound";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import Partner from "./pages/partner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* User will see */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* Admin will see */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        {/* Partner will see */}
        <Route path="/partner" element={<ProtectedRoute><Partner /></ProtectedRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<PNF />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
