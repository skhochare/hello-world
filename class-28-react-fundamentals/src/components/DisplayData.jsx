const DisplayData = ({ fruits = [], person = {} }) => {
    return (
        <div>
            <h2>Fruits List:</h2>
            <ul>
                {fruits.map((fruit, idx) => (
                    <li key={idx}>{fruit}</li>
                ))}
            </ul>

            <h2>Person Info:</h2>
            <p>Name: {person.name}</p>
            <p>Name: {person.age}</p>
        </div>
    );
};

export default DisplayData;