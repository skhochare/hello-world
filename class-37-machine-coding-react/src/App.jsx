import './App.css'

// import FocusInput from './components/FocusInput';
// import Timer from './components/Timer';
// import Stopwatch from './components/Stopwatch';
// import ImageCarousel from './components/ImageCarousel';
import Modal from "./components/Modal/index";
import useVisibility from './components/useVisibility';

function App() {
  const { isVisible, show, hide, toggle } = useVisibility(false);
  return (
    <div>
      <h1>Custom Hook</h1>
      <button onClick={show}>Show Modal</button>
      <button style={{ marginLeft: "4px" }} onClick={toggle}>Toggle Modal</button>
      <Modal isVisible={isVisible} hide={hide} />
    </div>
  )
}

export default App
