import './App.css'

// Component
// import MyComponent from "./components/MyComponent";
// import DisplayData from './components/DisplayData';
import ConditionalRendering from "./components/ConditionalRendering";
import Button from "./components/Button";

function App() {
  // const fruits = ['Apple', 'Banana', 'Kiwi', 'Orange', 'Mango'];
  // const person = {
  //   name: "Anshuman",
  //   age: 38
  // };

  // return (
  //   <div>
  //     <DisplayData fruits={fruits} person={person} />
  //   </div>
  // )

  return (
    <div>
      <ConditionalRendering isLoggedIn={true} username="Shashwat!" />
      <Button />
    </div>
  )
}

export default App
