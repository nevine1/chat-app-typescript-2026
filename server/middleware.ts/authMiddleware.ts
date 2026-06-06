import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


interface AuthenticatedRequest extends Request {
    userId?: string;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        //  Grab the token directly from cookies
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: Access denied, no token provided"
            });
            return;
        }

        //  Safely check for JWT_SECRET
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({
                success: false,
                message: "Internal server configuration error"
            });
            return;
        }

        //  Verify token and map the correct payload key ('userId')
        const decoded = jwt.verify(token, secret) as { userId: string };

        //  Attach the userId to the request object
        req.userId = decoded.userId; // Fixed matching payload key

        //  Pass userId to the next controller function
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token"
        });
        return;
    }
};

export default authMiddleware;