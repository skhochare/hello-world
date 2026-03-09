// import './App.css'
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';

// Pages
const HomePage = lazy(() => import("./pages/Home"));
const AboutPage = lazy(() => import("./pages/About"));
const ContactPage = lazy(() => import("./pages/Contact"));

function App() {
  const loadingComponent = <div>Loading...</div>;
  const homeLoadingComponent = <div>Home Page Loading....</div>
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={loadingComponent}>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={homeLoadingComponent}><HomePage /></Suspense>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
