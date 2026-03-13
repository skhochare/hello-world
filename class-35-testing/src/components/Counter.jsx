import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    const incCount = () => {
        setCount((count) => count + 1);
    };
    const decCount = () => {
        setCount((count) => count - 1);
    };

    return (
        <div>
            <h1>Counter</h1>
            <button onClick={incCount}>+</button>
            <h2>Count is {count}</h2>
            <button onClick={decCount}>-</button>
        </div>
    );
};

export default Counter;