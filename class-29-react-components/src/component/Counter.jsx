import { useState } from "react";

const Counter = ({ initialCount = 0 }) => {
    const [count, setCount] = useState(initialCount);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount((prevCount) => prevCount - 1);
    };

    const handleReset = () => {
        setCount(initialCount);
    };

    const shouldDisable = count === 0;

    return (
        <div>
            <h2>Count: {count}</h2>
            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleIncrement}>Increment</button>
                <button onClick={handleDecrement} disabled={shouldDisable}>Decrement</button>
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

export default Counter;