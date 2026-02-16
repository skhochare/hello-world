import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Friend = ({ isAdmin }) => {
    const [friend, setFriend] = useState(null);
    const { id: friendId } = useParams();

    useEffect(() => {
        (async function() {
            const response = await fetch(`https://fakestoreapi.com/users/${friendId}`);
            const friendData = await response.json();
            setFriend(friendData);
        })()
    }, []);

    if (friend === null) {
        return <h3>...Loading</h3>
    }

    return (
        <div>
            Name - {friend.name.firstname} {friend.name.lastname}
            <br />
            Email - {friend.email}
        </div>
    )
};

export default Friend;