exports.healthCheck = (req, res) => {
    res.status(200).json({ success: "true", message: "Backend is up and running!" });
};

exports.healthCheckV2 = (req, res) => {
    res.status(200).json({ success: "true", message: "Backend is up and running for V2!" });
};