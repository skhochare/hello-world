exports.testBody = (req, res) => {
    console.log(req.body);
    res.status(200).json({
        receivedBody: req.body
    });
};

exports.testError = (req, res, next) => {
    const error = new Error("This is a test error");
    error.statusCode = 400;

    console.log(error);
    next(error);
};