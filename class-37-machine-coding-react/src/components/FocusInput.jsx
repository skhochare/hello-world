import { useRef } from 'react';

function FocusInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        console.log(inputRef.current);
        inputRef.current.focus();
    };

    return (
        <div style={{ display: "flex", gap: "12px" }}>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus Input</button>
        </div>
    );
};

export default FocusInput;