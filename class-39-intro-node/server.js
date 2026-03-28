const express = require("express");

const app = express();

app.use(express.json());

// Sample user data (In-Memory)
const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
];

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, Scaler!");
});

app.post("/users", (req, res) => {
    const newUser = req.body;

    const userId = users.length + 1;
    newUser.id = userId;

    users.push(newUser);

    res.status(201).json({ message: "User created", user: newUser });
});

app.get("/users/:foobar", (req, res) => {
    const userId = parseInt(req.params.foobar);

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "user not found" });
    }

    const filteredUser = users.filter((user) => user.id === userId);
    res.json(filteredUser);
});

app.get("/all-users", (req, res) => {
    res.json(users);
});

app.use((req, res) => {
    res.status(404).json({
        success: "false",
        message: "Route not found!"
    });
});

const port = 3000;
app.listen(port, () => {
    console.log("Server is running on port: ", port);
});