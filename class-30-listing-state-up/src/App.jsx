import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// import Form from './component/Form';
// import AdvanceForm from './component/AdvanceForm'; 
import TemperatureInput from './component/TemperatureInput'
import TemperatureDisplay from './component/TemperatureDisplay'
import Test from './component/UseEffect';

function App() {
  const [temp, setTemp] = useState(0)

  const handleTempChange = (newTemp) => {
    setTemp(newTemp);
  };

  return (
    <>
      <div>
        {/* <Form /> */}
        {/* <AdvanceForm /> */}

        <Test />
        {/* <TemperatureInput temperature={temp} onTemperatureChange={handleTempChange} />
        <TemperatureDisplay temperature={temp} /> */}
      </div>
    </>
  )
}

export default App
