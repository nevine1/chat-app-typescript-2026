import express from 'express'
import {
    createUser, signInUser, isUserAuthenticated,
    updateProfile, getUserProfile
} from '../controller/userController.ts'
import upload from '../middleware/upload.ts'
import authMiddleware from '../middleware/authMiddleware.ts'
const userRouter = express.Router()


userRouter.post('/register', createUser)
userRouter.post('/login', signInUser)
userRouter.put('/update', authMiddleware, upload.single("profilePic"), updateProfile)
userRouter.get('/check', authMiddleware, isUserAuthenticated)
userRouter.get('/userProfile', authMiddleware, getUserProfile)

export default userRouter