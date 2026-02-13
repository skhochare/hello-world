const Button = () => {
    const handleClick = () => {
        console.log("Button Clicked!");
    };

    return (
        <button onClick={handleClick}>Click me!</button>
    );
};

export default Button;