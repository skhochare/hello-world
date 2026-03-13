import { useState, useEffect } from 'react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        console.log("Component Did Mount: Fetching initial todo items");
        setTimeout(() => {
            setTodos(['Learn React', 'Read a book']);
        }, 1000);

        return () => {
            console.log('Component will unmount: Cleaning up resources');
        };
    }, []);

    useEffect(() => {
        console.log("Component Did Update: Checking if new todo was added");
        console.log('Updated todos: ', todos);
    }, [todos]);

    const handleInputChange = (event) => {
        setNewTodo(event.target.value);
    };

    const handleAddToDo = () => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTodo('');
    }

    console.log("Render: Rendering the to-do list");
    return (
        <div>
            <h1>My To-Do List</h1>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
            />
            <button onClick={handleAddToDo}>Add To-Do</button>
        </div>
    );
};

export default TodoList;