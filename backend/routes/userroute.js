import { logout , login, registerUser, verification } from '../controller/usercontroller.js'
import {isAuthenticated} from '../middleware/autehntication-middleware.js'
import express, { Router } from 'express'
const router = express.Router()

router.post('/register' , registerUser)
router.post('/verify' , verification)
router.post('/login' , login)
router.post('/logout' , isAuthenticated , logout)

export default router