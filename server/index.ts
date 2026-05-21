import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './lib/db';
dotenv.config()
const app = express();
app.use(cors());

const port = process.env.PORT || 4000;
connectDB(); // Call the function to connect to the database
app.get('/', (req, res) => {
    res.send("Server is running successfully!")
})
app.listen(port, () => {
    console.log("Server is running on port " + port)
})