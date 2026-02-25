import React from 'react';
import { useSelector } from 'react-redux';
function CounterRedux(){
  const {count} = useSelector((store) => {return store.counterState})
    const handleIncrement = () => {
        console.log("increment will happen");
    }
    
    const handleDecrement = () => {
        console.log("decrement will happen");
    }
    return(
        <>
            <button onClick = {handleIncrement}> + </button>
            <h3>{count}</h3>
            <button onClick = {handleDecrement}> - </button>
        </>
    )
}

export default CounterRedux