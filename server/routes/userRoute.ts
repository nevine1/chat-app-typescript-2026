import express from 'express'
import {
    createUser, signInUser, isUserAuthenticated,
    updateProfile, getUserProfile, getAllUsers
} from '../controller/userController'
import upload from '../middleware/multer.ts'
import authMiddleware from '../middleware/authMiddleware.ts'
const userRouter = express.Router()


userRouter.post('/register', createUser)
userRouter.post('/login', signInUser)
userRouter.put('/update', authMiddleware, upload.single("profilePic"), updateProfile)
userRouter.get('/check', authMiddleware, isUserAuthenticated)
userRouter.get('/userProfile', authMiddleware, getUserProfile)
userRouter.get('/allUsers', authMiddleware, getAllUsers)

export default userRouter