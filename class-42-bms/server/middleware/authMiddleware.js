import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Server misconfigured",
            });
        }

        const decoded = jwt.verify(token, secret)

        req.userId = decoded.userId;
        return next();
    } catch(err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};