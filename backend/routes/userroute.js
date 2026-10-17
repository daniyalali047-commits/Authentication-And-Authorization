import { registerUser } from '../controller/usercontroller.js'
import express, { Router } from 'express'
const router = express.Router()

router.post('/register' , registerUser)

export default router