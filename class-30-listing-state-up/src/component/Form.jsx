import { useState } from "react";

const Form = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Handler for form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(`Name: ${name}, Email: ${email}`);

        setName("");
        setEmail("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='name'>Name:</label>
                <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <label htmlFor='email'>Email:</label>
                <input type='text' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button type='submit'>Submit</button>
        </form>
    );
};

export default Form;