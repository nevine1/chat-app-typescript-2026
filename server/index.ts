import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './lib/db.js'
import userRouter from './routes/uerRoute.ts'
dotenv.config()

const app = express();

// Helmet helps secure your apps by setting various HTTP headers
app.use(helmet());


const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Allow cookies/authorization headers if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// rate Limiting - Prevent Brute Force / DDoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

// body parser with strict size limits (Prevents massive payload attacks)
app.use(express.json({ limit: '10kb' }));

// Connect to Database
connectDB();

//api routes
app.use("/api/users", userRouter);
app.get('/', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// global Error Handling Middleware (Catches unhandled errors so the server doesn't crash)
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
    console.error(err.stack); // Log internally for you to see

    res.status(500).json({
        error: 'An internal server error occurred.'
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {

    console.log(`Server is running on port ${port}`);
});