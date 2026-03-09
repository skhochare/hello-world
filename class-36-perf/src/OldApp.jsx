// import './App.css'
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';

function App() {
  const [HomePage, setHomePage] = useState(null);
  const [AboutPage, setAboutPage] = useState(null);
  const [ContactPage, setContactPage] = useState(null);

  useEffect(() => {
    import ("./pages/Home").then((module) => setHomePage(() => module.default));
  }, []);

  const loadHomePage = () => {
    import ("./pages/Home").then((module) => setHomePage(() => module.default));
  };

  const loadAboutPage = () => {
    import ("./pages/About").then((module) => setAboutPage(() => module.default));
  };

  const loadContactPage = () => {
    import ("./pages/Contact").then((module) => setContactPage(() => module.default));
  };

  const loadingComponent = <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar loadHomePage={loadHomePage} loadAboutPage={loadAboutPage} loadContactPage={loadContactPage} />
      <Routes>
        <Route path="/" element={HomePage ? <HomePage /> : loadingComponent} />
        <Route path="/about" element={AboutPage ? <AboutPage /> : loadingComponent} />
        <Route path="/contact" element={ContactPage ? <ContactPage /> : loadingComponent} />
      </Routes>  
    </BrowserRouter>
  )
}

export default App
