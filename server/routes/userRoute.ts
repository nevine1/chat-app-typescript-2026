import express from 'express'
import { createUser, signInUser, isUserAuthenticated } from '../controller/userController.ts'
const userRouter = express.Router()


userRouter.post('/register', createUser)
userRouter.post('/login', signInUser)
userRouter.get('/check', isUserAuthenticated)


export default userRouter