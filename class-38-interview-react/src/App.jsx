import './App.css'
// import ToDoList from './components/Todo'
// import TodoList from './components/TodoFunc'
// import Counter from './components/Counter'
// import Welcome from './components/ClassComponent'
import DataComponent from './components/DataComponent'
import WithLoading from './components/WithLoading'

const EnhancedDataComponent = WithLoading(DataComponent);

function App() {
  return (
    // <Welcome name={"Scaler"} />
    // <Counter />
    // <ToDoList />
    // <TodoList />
    <EnhancedDataComponent data="Here is some data!" />
  )
}

export default App
