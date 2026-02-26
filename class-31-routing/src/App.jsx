import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Friend from "./pages/Friend";
import PageNotFound from "./pages/PageNotFound";

function App() { 
  const shouldSeeFriends = true;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/friend/:id" element={
        shouldSeeFriends ? <Friend isAdmin={false} /> : <Navigate to="/" />
      } />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App;
