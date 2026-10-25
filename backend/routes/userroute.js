import { registerUser, verification } from '../controller/usercontroller.js'
import express, { Router } from 'express'
const router = express.Router()

router.post('/register' , registerUser)
router.post('/verify' , verification)

export default router