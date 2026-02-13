import { useState } from "react";

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");

    const addTask = () => {
        if (input.trim() !== "") {
            setTasks([...tasks, input]);
            setInput("");
        }
    };

    const removeTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    return (
        <div style={{
            maxWidth: "400px",
            margin: "auto",
            textAlign: "center"
        }}>
            <h2>To-Do List</h2>
            <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Enter task"
                style={{ marginRight: "10px", padding: "10px" }}
            />
            <button disabled={!input} onClick={addTask}>Add Task</button>

            {tasks.length === 0 ? <div style={{ marginTop: "20px" }}>No tasks added yet.</div> : (
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            {task}
                            <button
                                style={{ marginLeft: "8px", background: "none" }}
                                onClick={() => removeTask(index)}
                            >
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Todo;