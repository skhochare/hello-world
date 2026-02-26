import { useState, useEffect } from 'react';

const Test = () => {

    
    const [count, setCount] = useState(0);
    const [test, setTest] = useState('');

    const increment = () => {
        setCount(count+1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    useEffect(() => {
        console.log("UseEffect triggered!");
    }, [count]);


    return (
        <div>
            <div>{count}</div>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={() => setTest("Hello")}>Testing</button>
        </div>
    );
};

export default Test;
