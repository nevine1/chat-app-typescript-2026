import express from 'express'
import { createUser } from '../controller/userController.ts'
const userRouter = express.Router()


userRouter.post('/createUser', createUser)

export default userRouter