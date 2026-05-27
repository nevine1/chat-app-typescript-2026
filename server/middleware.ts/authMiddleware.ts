import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend the Express Request type cleanly without using 'any'
interface AuthenticatedRequest extends Request {
    userId?: string;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        //  Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        //  Attach the userId to the request object so protected controllers can use it
        req.userId = decoded.id;

        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token"
        });
        return;
    }
};

export default authMiddleware;