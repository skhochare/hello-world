import React from 'react';

class ToDoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            newTodo: ''
        };

        console.log("Construvtor: Setting up initial state and buildings");
    }

    componentDidMount() {
        console.log('Component Did Mount: Fetching initial to-do items.');

        // Simulate fetching data from an API
        setTimeout(() => {
            this.setState({
                todos: ['Learn React', 'Read a book']
            });
        }, 1000);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('Component Did Update: Checking if new to-do was added.');
        if (prevState.todos !== this.state.todos) {
            console.log("Updated To-dos", this.state.todos);
        }
    }

    componentWillUnmount() {
        console.log("Component Will Unmount: Cleaning up resources");
    }

    handleInputChange = (event) => {
        this.setState({ newTodo: event.target.value });
    }

    handleAddToDo = () => {
        this.setState((state) => ({
            todos: [...state.todos, state.newTodo],
            newTodo: ""
        }))
    }

    render() {
        console.log('Render: Rendering the to-do list.');
        return (
            <div>
                <h1>My To-Do List</h1>
                <ul>
                    {this.state.todos.map((todo, index) => (
                        <li key={index}>{todo}</li>
                    ))}
                </ul>
                <input
                    type="text"
                    value={this.state.newTodo}
                    onChange={this.handleInputChange}
                />
                <button onClick={this.handleAddToDo}>Add To-Do</button>
            </div>
        );
    }
};

export default ToDoList;