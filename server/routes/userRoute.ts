import express from 'express'
import { createUser, signInUser } from '../controller/userController.ts'
const userRouter = express.Router()


userRouter.post('/register', createUser)
userRouter.post('/login', signInUser)

export default userRouter