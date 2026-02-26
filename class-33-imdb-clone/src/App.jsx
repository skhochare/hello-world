import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import WatchList from "./Components/WatchList";
import MovieContextWrapper from "./Context/MovieContext";
function App() {
  return (
    <MovieContextWrapper>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchlist" element={<WatchList />} />
      </Routes>
    </MovieContextWrapper> 
  )
}

export default App
