import { useState } from "react";

const UserCard = ({ user }) => {
    const [showEmail, setShowEmail] = useState(false);

    const toggleShowEmail = () => {
        // setShowEmail((prevShowEmail) => !prevShowEmail);
        const newValue = !showEmail;
        setShowEmail(newValue);
    };

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            minWidth: "200px"
        }}>
            <img style={{ borderRadius: "50%", width: "100px", height: "100px", objectFit: "cover" }} src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>Age: {user.age} ({user.age > 18 ? "Adult" : "Minor"})</p>
            <p>Email: {showEmail ? user.email : "********"}</p>
            <button onClick={toggleShowEmail}>{showEmail ? "Hide Email" : "Show Email"}</button>
        </div>
    );
};

export default UserCard;