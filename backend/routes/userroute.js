import { login, registerUser, verification } from '../controller/usercontroller.js'
import express, { Router } from 'express'
const router = express.Router()

router.post('/register' , registerUser)
router.post('/verify' , verification)
router.post('/login' , login)

export default router