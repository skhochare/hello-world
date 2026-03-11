import { useRef, useState, useEffect } from "react";

function Timer() {
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef(null);

    const handleStopTimer = () => {
        clearInterval(intervalRef.current);
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return handleStopTimer;
    }, []);

    return (
        <div>
            <p>Seconds: {seconds}</p>
            <button onClick={handleStopTimer}>Stop Timer</button>
        </div>
    );
};

export default Timer;