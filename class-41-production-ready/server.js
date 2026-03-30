// Create the express app
const express = require("express");
const app = express();

const healthRoutes = require("./routes/healthRoutes.js");
const moviesRoutes = require("./routes/moviesRoutes.js");
const testRoutes = require("./routes/testRoutes.js");

// Middlewares
const notFound = require("./middlewares/notFound.js");
const errorhandler = require("./middlewares/errorHandler.js");

// Register global middleware
app.use(express.json());

// Define routes!
app.use("/api", healthRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/tests", testRoutes);

// Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(errorhandler);

// Start server
const port = 3000;
app.listen(port, () => {
    console.log("Server is running on port: ", port);
});