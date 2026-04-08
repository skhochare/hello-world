import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";

const Home = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data?.data?.user);
            } catch(err) {
                setError("Failed to load profile");
            }
        };

        fetchMe();
    }, []);

    if (error) return <div>{error}</div>
    if (!user) return <div>...Loading</div>

    return (
        <div>
            <h2>Home Component</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    )
};

export default Home;